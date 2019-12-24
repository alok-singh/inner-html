const fs = require('fs');
const path = require('path');
const pwd = path.resolve(__dirname, 'htmls');

module.exports = (categoryFolderName, folderName, html) => {
    if(categoryFolderName && !fs.existsSync(path.resolve(pwd, categoryFolderName))) {
        fs.mkdirSync(path.resolve(pwd, categoryFolderName));
    }
    if(folderName && !fs.existsSync(path.resolve(pwd, categoryFolderName, folderName))) {
        fs.mkdirSync(path.resolve(pwd, categoryFolderName, folderName));
    }
    if(!categoryFolderName && !folderName) {
        fs.writeFileSync(path.resolve(pwd, 'index.html'), html);
    }
    fs.writeFileSync(path.resolve(pwd, categoryFolderName, folderName, 'index.html'), html);
}