const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const fs= require('fs')

function handleDate(value) {
	const date = new Date(value)
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addFilter("date", handleDate);
  eleventyConfig.addJavaScriptFunction("handleDate", handleDate);
  eleventyConfig.setLibrary('md', markdownIt({
    html: true,
    breaks: true,
    linkify: false
  }));
	eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });
	eleventyConfig.addPassthroughCopy("assets");

	return {
    // Use nunjucks in html templates
    htmlTemplateEngine: 'njk'
  };
}