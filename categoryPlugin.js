import path from "node:path";
import fs from "node:fs/promises";
import { getPageData } from "./sharedUtils.js";
import { renderTemplate } from "./node_modules/@basic-ssg/core/dist/utils/renderTemplate.js";
import { buildNavTree, categoryMap, getTitle, parseDate, normalizeSlug } from "./sharedUtils.js";

export const categoryPlugin = () => ({
    name: "category-filter-plugin",
    setup: (config) => ({
        beforeBuild: [
            {
                glob: ["pages/blog/posts/**", "pages/blog/calculadora.ejs", "pages/blog/custom/articles.ejs"],
                fn: async (files, cfg) => {
                    const blogBase = "pages/blog";
                    const postsBase = path.join(blogBase, "posts");
                    const templatePath = path.join(blogBase, "custom", "articles.ejs");

                    // 1. Build the full tree
                    const navTree = await buildNavTree(postsBase, postsBase);
                    
                    // 2. Save navTree to dist/blog/nav-tree.json for client-side/reference
                    const navTreeJsonPath = path.join(cfg.paths.dist, "blog", "nav-tree.json");
                    await fs.mkdir(path.dirname(navTreeJsonPath), { recursive: true });
                    await fs.writeFile(navTreeJsonPath, JSON.stringify(navTree, null, 2));

                    // 3. Write _nav-data.ejs partial for robust data sharing across all EJS pages
                    const componentsDir = path.join(blogBase, "components");
                    await fs.mkdir(componentsDir, { recursive: true });
                    const navDataContent = `<% locals.navTree = ${JSON.stringify(navTree)}; %>`;
                    await fs.writeFile(path.join(componentsDir, "_nav-data.ejs"), navDataContent);

                    const allArticles = [];
                    const renderPromises = [];

                    // 4. Recursively generate index pages for all folders
                    async function generateFolderIndices(items, ancestorBreadcrumbs = [{ label: 'Início', url: '/blog' }]) {
                        for (const item of items) {
                            if (item.type === 'folder') {
                                const folderPath = path.join(postsBase, item.path);
                                const articles = await getPageData(path.join(folderPath, "*.md"));
                                const outputPath = path.join(cfg.paths.dist, "blog", item.path, "index.html");

                                const metadata = categoryMap[item.name] || {
                                    title: item.title,
                                    description: `Explorar artigos em ${item.title}.`
                                };

                                const currentBreadcrumbs = [
                                    ...ancestorBreadcrumbs,
                                    { label: item.title, url: item.url }
                                ];

                                const mappedArticles = articles.map(a => {
                                    const dateObj = parseDate(a.date);
                                    return {
                                        postName: a.title,
                                        postUrl: a.slug,
                                        postDate: dateObj.getTime() > 0 ? dateObj.toLocaleDateString("pt-BR") : "",
                                        postDescription: a.description,
                                        coverImage: a.coverImage,
                                        tags: a.tags,
                                        _date: dateObj
                                    };
                                }).sort((a, b) => b._date - a._date);

                                renderPromises.push(renderTemplate(templatePath, outputPath, {
                                    articles: mappedArticles,
                                    categoryTitle: metadata.title,
                                    categoryDescription: metadata.description,
                                    categorySlug: item.name,
                                    navTree,
                                    currentPath: item.url,
                                    breadcrumbs: currentBreadcrumbs
                                }));

                                await generateFolderIndices(item.children, currentBreadcrumbs);
                            } else {
                                const parentDir = path.dirname(item.path);
                                const categoryName = parentDir === '.' ? 'Blog' : getTitle(path.basename(parentDir));
                                
                                const dateObj = parseDate(item.date);
                                allArticles.push({
                                    postName: item.title,
                                    postUrl: item.slug,
                                    postDate: dateObj.getTime() > 0 ? dateObj.toLocaleDateString("pt-BR") : "",
                                    postDescription: item.description,
                                    coverImage: item.coverImage,
                                    tags: item.tags,
                                    category: categoryName,
                                    slug: item.slug,
                                    _date: dateObj
                                });
                            }
                        }
                    }

                    await generateFolderIndices(navTree);

                    // Sort all articles by date descending
                    allArticles.sort((a, b) => b._date - a._date);

                    // 5. Explicitly render home and calculadora to ensure they get the navTree
                    const staticPages = [
                        { tpl: "pages/blog/custom/articles.ejs", out: "blog/articles/index.html", path: "/blog/articles", title: "Atualizações Recentes" },
                        { tpl: "pages/blog/calculadora.ejs", out: "blog/calculadora.html", path: "/blog/calculadora", title: "Calculadoras" }
                    ];

                    for (const page of staticPages) {
                        try {
                            const tplPath = path.join(process.cwd(), page.tpl);
                            if (await fs.stat(tplPath).catch(() => false)) {
                                renderPromises.push(renderTemplate(page.tpl, path.join(cfg.paths.dist, page.out), {
                                    articles: allArticles, 
                                    navTree,
                                    categoryTitle: page.title,
                                    currentPath: page.path,
                                    breadcrumbs: [
                                        { label: 'Início', url: '/blog' },
                                        { label: page.title, url: '' }
                                    ]
                                }));
                            }
                        } catch (e) {
                            console.error(`Error rendering static page ${page.tpl}:`, e);
                        }
                    }

                    await Promise.all(renderPromises);

                    // 6. Write search index
                    const searchIndexPath = path.join(cfg.paths.dist, "blog", "search-index.json");
                    await fs.writeFile(searchIndexPath, JSON.stringify(allArticles, null, 2));
                }
            }
        ]
    })
});
