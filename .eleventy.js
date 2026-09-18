module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.ignores.add("README.md");

  eleventyConfig.addFilter("readableDate", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    });
  });

  eleventyConfig.addCollection("blogs", (collectionApi) => {
    return collectionApi.getFilteredByGlob("blogs/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("writeups", (collectionApi) => {
    return collectionApi.getFilteredByGlob("writeups/*.md").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
