const minify = require('html-minifier').minify;

module.exports = (head, body) => {
    return minify(`<html lang="en">
        <head>${head}</head>
        <body>${body}</body>
    </html>`, {
        minifyCSS: true,
        conservativeCollapse: true,
        minifyJS: true,
        removeComments: true
    })
}


