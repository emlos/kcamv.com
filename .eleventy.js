const Image = require("@11ty/eleventy-img");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const markdownIt = require("./src/markdown.js");
const outdent = require("outdent");
const path = require("node:path");

const OUTPUTDIR = "public"

function price(base, modifier=false) {
  var multiplier = price
  if (modifier)  multiplier = modifier
  return parseFloat(base) * multiplier
 
}

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(`./src${src}`, {
    widths: [300, 800, null],
    formats: ["avif", "jpeg"],
    urlPath: "/images/",
    outputDir: "./public/images/",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

function markdownToHtmlShortcode(children, tag, class_ = false, id = false) {
  const content = markdownIt.render(children);
  return outdent`<${tag} ${class_ ? `class="${class_}"` : ""} ${
    id ? `id="${id}"` : ""
  }>${content}</${tag}>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css/*.css");
  eleventyConfig.addWatchTarget("./src/css/*.css");
  eleventyConfig.addPassthroughCopy("./src/images/");
  eleventyConfig.addPassthroughCopy("./src/scripts/*.js");

  
  eleventyConfig.addShortcode("date", () => `${new Date().getUTCDate}`);
  eleventyConfig.addPairedShortcode("tag", markdownToHtmlShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);

  //filters


  //plugins
  eleventyConfig.addPlugin(faviconsPlugin, {"outputDir": OUTPUTDIR});
  eleventyConfig.setLibrary("md", markdownIt);


  return {
    dir: {
      input: "src",
      output: OUTPUTDIR,
      markdownTemplateEngine: "njk",
    },
  };
};
