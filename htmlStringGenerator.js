const minify = require('html-minifier').minify;

module.exports = (head, body) => {
	return minify(
		`<html lang="en">
            ${head}
            ${body}
        </html>`,
		{
			minifyCSS: true,
			conservativeCollapse: true,
			minifyJS: true,
			removeComments: true,
		},
	);
};
