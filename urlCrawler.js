const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const {START_URL, FILE_NAME} = require('./urlCrawlerConfig');
const allUrls = { [START_URL]: true };
let urls = [START_URL];

const updateUrls = (newEntries, currentList) => {
	return Object.keys(
		newEntries.concat(currentList).reduce((acc, url) => {
			if (!allUrls[url]) {
				allUrls[url] = true;
				acc[url] = true;
			}
			return acc;
		}, {}),
	);
};

const evaluationScript = async () => {
	const dataUrls = [];
	document.querySelectorAll('a').forEach(a => {
		if (
			a &&
			a.attributes &&
			a.attributes.href &&
			a.attributes.href.value &&
			a.attributes.href.value[0] === '/' &&
			a.attributes.href.value[1] !== '/' &&
			a.href.indexOf('www.astroawani.com') === -1 &&
			a.dataset.listType !== 'footer'
		) {
			dataUrls.push(a.href);
		}
	});
	return dataUrls;
};

const getInnerHTML = async (page, url) => {
	try {
		await page.goto(url, { waitUntil: 'networkidle2' });
		const dataUrls = await page.evaluate(evaluationScript);
		urls = updateUrls(dataUrls, urls).concat(urls);
		await page.close();
	} catch (error) {
	}
};

const fetchURLData = async browserInstance => {
	while(urls.length) {
		console.log(urls.length);
		const page = await browserInstance.newPage();
		await getInnerHTML(page, urls.pop());
		fs.writeFile(
			path.resolve(__dirname, FILE_NAME),
			JSON.stringify(Object.keys(allUrls), null, '    '),
			() => {
			},
		);
	}
	return true;
};

const init = async () => {
	const browserInstance = await puppeteer.launch();
	await fetchURLData(browserInstance);
	await browserInstance.close();
};

init();
