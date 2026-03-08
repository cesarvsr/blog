import fg from "fast-glob";
import path from "node:path";
import fs from "node:fs/promises";
import { getPageData } from "./node_modules/@basic-ssg/core/dist/utils/getPageData.js";
import { renderTemplate } from "./node_modules/@basic-ssg/core/dist/utils/renderTemplate.js";

const categoryMap = {
    "clinica-medica": {
        title: "Clínica Médica",
        description: "Diretrizes e protocolos atualizados para medicina interna."
    },
    "cirurgia": {
        title: "Cirurgia",
        description: "Protocolos e condutas em cirurgia geral e especializada."
    },
    "pediatria": {
        title: "Pediatria",
        description: "Cuidados e diretrizes para neonatologia e pediatria."
    },
    "ginecologia": {
        title: "Ginecologia & Obstetrícia",
        description: "Protocolos atualizados para saúde da mulher."
    }
};

export const categoryPlugin = () => ({
    name: "category-filter-plugin",
    setup: (config) => ({
        beforeBuild: [
            {
                glob: ["pages/blog/posts/**"],
                fn: async (files, cfg) => {
                    const blogBase = "pages/blog";
                    const postsBase = path.join(blogBase, "posts");
                    const templatePath = path.join(blogBase, "custom", "articles.ejs");

                    // Find all subdirectories in posts/
                    const categories = await fg(path.join(postsBase, "*"), { onlyDirectories: true });
                    const allArticles = [];

                    await Promise.all(categories.map(async (catDir) => {
                        const catSlug = path.basename(catDir);
                        const articles = await getPageData(path.join(catDir, "*.md"));
                        const outputPath = path.join(cfg.paths.dist, "blog", catSlug, "index.html");

                        const metadata = categoryMap[catSlug] || {
                            title: catSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            description: `Explorar artigos em ${catSlug}.`
                        };

                        // Collect for search index
                        articles.forEach(art => {
                            allArticles.push({
                                title: art.postName,
                                description: art.postDescription || "",
                                url: `/blog/articles/${art.postUrl}`,
                                category: metadata.title,
                                slug: art.postUrl
                            });
                        });

                        return renderTemplate(templatePath, outputPath, {
                            articles,
                            categoryTitle: metadata.title,
                            categoryDescription: metadata.description,
                            categorySlug: catSlug
                        });
                    }));

                    // Write search index to dist/blog
                    const searchIndexPath = path.join(cfg.paths.dist, "blog", "search-index.json");
                    await fs.mkdir(path.dirname(searchIndexPath), { recursive: true });
                    await fs.writeFile(searchIndexPath, JSON.stringify(allArticles, null, 2));
                }
            }
        ]
    })
});
