module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("site/static");
    return {
        dir: {
            input: "site"
        },
        pathPrefix: "/terrabook/"
    }
};