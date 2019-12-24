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
  return {
    body: document.body.innerHTML,
    head: document.head.innerHTML
  };
};

const getInnerHTML = async (page, url, identifier) => {
  await page.goto(url);
  await page.waitFor(identifier);
  const { body, head } = await page.evaluate(evaluationScript);
  const pathArray = url.split("/");
  const folderName = pathArray.pop();
  const categoryFolderName = pathArray.pop();
  fileSystem(categoryFolderName, folderName, htmlStringGenerator(head, body));
};

const init = async () => {
  const browserInstance = await puppeteer.launch();
  const page = await browserInstance.newPage();
  await Promise.all(urls.map(url => getInnerHTML(page, url, ".article-text")));
  browserInstance.close();
};

init();
