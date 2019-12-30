const puppeteer = require("puppeteer");
const urls = require("./urls");
const fileSystem = require("./fileSystem");
const htmlStringGenerator = require("./htmlStringGenerator");

const evaluationScript = async () => {
  document.querySelectorAll("script").forEach(script => {
    if (script.attributes.src && script.attributes.src.value) {
      script.attributes.src.value = script.src;
    }
  });
  document.querySelectorAll("noscript").forEach(noScript => {
    noScript.remove();
  })
  return {
    body: document.body.innerHTML,
    head: document.head.innerHTML
  };
};

const getInnerHTML = async (page, url, identifier) => {
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const { body, head } = await page.evaluate(evaluationScript);
    const pathArray = url.split("/").slice(3);
    const folderName = pathArray.pop();
    const categoryFolderName = pathArray.pop();
    fileSystem(
      categoryFolderName || "",
      folderName || "",
      htmlStringGenerator(head, body)
    );
    await page.close();
  } catch (error) {
    console.log(error);
  }
};

const fetchURLData = async (browserInstance, { url, identifier }) => {
  const page = await browserInstance.newPage();
  return await getInnerHTML(page, url, identifier);
};

const init = async () => {
  const browserInstance = await puppeteer.launch();
  const sequalise = async urls => {
    await fetchURLData(browserInstance, urls.pop());
    if (urls.length) {
      sequalise(urls);
    } else {
      await browserInstance.close();
    }
  };
  sequalise(urls);  
};

init();
