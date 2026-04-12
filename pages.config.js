import { ejsPlugin, sitemapPlugin, tailwindPlugin } from "basic-ssg";
import { assetsPlugin } from "@basic-ssg/plugin-assets";
import { categoryPlugin } from "./categoryPlugin.js";
import { customBlogPlugin } from "./customBlogPlugin.js";
import { mapaPlugin } from "./mapaPlugin.js";
import { resumoPlugin } from "./resumoPlugin.js";

export default {
  root: "pages",
  outDir: "dist",
  plugins: [
    assetsPlugin(),
    mapaPlugin(),
    categoryPlugin(),
    resumoPlugin(),
    ejsPlugin(),
    tailwindPlugin(),
    sitemapPlugin(),
    customBlogPlugin({
      mdPaths: "posts/**/*.md"
    }),
  ],
  siteUrls: {
    blog: "https://dgramaciotti.github.io",
  },
};
