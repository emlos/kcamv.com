const Image = require("@11ty/eleventy-img");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const markdownIt = require("./src/markdown.js");
const outdent = require("outdent");
const path = require("node:path");
const glob = require("glob-promise");

const OUTPUTDIR = "public";
const GALLERY_SIZE = 600;

async function imageShortcode(src, alt, sizes, subdir="") {
  let metadata = await Image(`./src${src}`, {
    widths: [300, 800, null],
    formats: ["avif", "jpeg"],
    urlPath: "/images/" + subdir,
    outputDir: "./public/images/" + subdir,
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
  eleventyConfig.addPassthroughCopy("./src/fonts/*.woff");
  eleventyConfig.addPassthroughCopy("./src/fonts/*.woff2");

  eleventyConfig.addPassthroughCopy("./src/images/");
  eleventyConfig.addPassthroughCopy("./src/scripts/*.js");

  //collections

  // all images in images
  
  eleventyConfig.addCollection("examples", async (collectionApi) => {
    const base = "./src/images/**/**/";
    let images = await glob(base + "*.{png,jpg}");

    return makeImgCollection(images);
  });
  eleventyConfig.addCollection("sketches", async (collectionApi) => {
    const base = "./src/images/**/sketches/";
    let images = await glob(base + "*.{png,jpg}");

    return makeImgCollection(images,sketch=false);
  });

  eleventyConfig.addCollection("flats", async (collectionApi) => {
    const base = "./src/images/**/flats/";
    let images = await glob(base + "*.{png,jpg}");

    return makeImgCollection(images,sketch=false);
  });
  eleventyConfig.addCollection("paintings", async (collectionApi) => {
    const base = "./src/images/**/paintings/";
    let images = await glob(base + "*.{png,jpg}");

    return makeImgCollection(images,sketch=false);
  });

  eleventyConfig.addCollection("portraits", async (collectionApi) => {
    const base = "./src/images/**/portraits/";
    let images = await glob(base + "*.{png,jpg}");

    return makeImgCollection(images,sketch=false);
  });

  //shortcodes
  eleventyConfig.addPairedShortcode("tag", markdownToHtmlShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);

  //filters

  //plugins
  eleventyConfig.addPlugin(faviconsPlugin, { outputDir: OUTPUTDIR });
  eleventyConfig.setLibrary("md", markdownIt);

  return {
    dir: {
      input: "src",
      output: OUTPUTDIR,
      markdownTemplateEngine: "njk",
    },
  };
};

function makeImgCollection(images, sketch = true) {
  //actual collection to be born into eleventy proper
  let collection = images
    .filter((j) => {

      return sketch? j.split('/').indexOf("sketches") < 0 : true;
    })
    .map((i) => {
      return {
        relDirPath: i.split("./src")[1].split('/').slice(0,-1).join("/"),
        source: i.split("./src")[1], // "/images/examples/xxxxxxx.png", removes the ./src lol
        title: i
          .split("\\")
          .pop()
          .split("/")
          .pop()
          .split(".")[0]
          .replaceAll("_", " "),

      };
    });

  return collection;
}
