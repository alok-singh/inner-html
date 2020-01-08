const puppeteer = require('puppeteer');
const urls = require('./urls');
// const urls = require('./deAwani.json');
const fileSystem = require('./fileSystem');
const htmlStringGenerator = require('./htmlStringGenerator');

const evaluationScript = async () => {
	const delay = time => {
		return new Promise(resolve => { 
			setTimeout(resolve, time)
		});
	 }
	const getCSSStringFromCSSOM = style => {
		let cssString = '';
		if (
			style &&
			style.sheet &&
			style.sheet.cssRules &&
			style.sheet.cssRules.length
		) {
			[style.sheet.cssRules].forEach(rule => {
				cssString = `${cssString} ${rule.cssText}`;
			});
		}
		return cssString;
	};
	await delay(5000);
	const scriptElement = document.createElement('script');
	scriptElement.innerHTML = `
		window.addEventListener('load', function(){
			sQuery.toJSON = sQuery.parseJSON
		});
	`;
	document.head.append(scriptElement);
	document.querySelectorAll('script').forEach(script => {
		if (script.attributes.src && script.attributes.src.value) {
			script.attributes.src.value = script.src;
		}
		if (script.innerHTML) {
			script.remove();
		}
	});
	document.querySelectorAll('iframe').forEach(iframe => {
		if (iframe.attributes.src && iframe.attributes.src.value) {
			iframe.attributes.src.value = iframe.src;
		}
	});
	document.querySelectorAll('link').forEach(link => {
		if (link.attributes.href && link.attributes.href.value) {
			link.attributes.href.value = link.href;
		}
	});
	document.querySelectorAll('noscript').forEach(noScript => {
		noScript.remove();
	});
	document.querySelectorAll('[data-emotion]').forEach(style => {
		if(!style.innerHTML) {
			style.innerHTML = getCSSStringFromCSSOM(style);
		}
	});
	document.querySelectorAll('[data-styled]').forEach(style => {
		if(!style.innerHTML) {
			style.innerHTML = getCSSStringFromCSSOM(style);
		}
	});
	return {
		body: document.body.outerHTML,
		head: document.head.outerHTML,
	};
};

const getInnerHTML = async (page, url) => {
	try {
		await page.goto(url, { waitUntil: 'networkidle2' });
		const { body, head, inlineScript } = await page.evaluate(
			evaluationScript,
		);
		const pathArray = url.split('/').slice(3);
		const folderName = pathArray.pop();
		const categoryFolderName = pathArray.pop();
		fileSystem(
			categoryFolderName || '',
			folderName || '',
			htmlStringGenerator(head, body, inlineScript),
		);
		await page.close();
	} catch (error) {
		console.log(error);
	}
};

const fetchURLData = async (browserInstance, url) => {
	const page = await browserInstance.newPage();
	console.log(url);
	return await getInnerHTML(page, url);
};

const init = async () => {
	const browserInstance = await puppeteer.launch();
	const sequalise = async urls => {
		await fetchURLData(browserInstance, urls.pop());
		if (urls.length) {
			console.log('remaining', urls.length);
			sequalise(urls);
		} else {
			await browserInstance.close();
		}
	};
	sequalise(urls);
};

init();
