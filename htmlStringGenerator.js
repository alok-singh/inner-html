const minify = require('html-minifier').minify;

module.exports = (head, body) => {
    return minify(`<html lang="en">
        <head>
            ${head}
            <script>
                window.addEventListener('load', function(){
                    sQuery.toJSON = sQuery.parseJSON;
                });
            </script>
        </head>
        <body>${body}</body>
    </html>`, {
        minifyCSS: true,
        conservativeCollapse: true,
        minifyJS: true,
        removeComments: true
    })
}


