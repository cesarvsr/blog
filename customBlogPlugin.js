import path from "node:path";
import fs from "node:fs";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import markdownit from "markdown-it";
import matter from "gray-matter";
import { renderFile } from "ejs";
import { buildNavTree, categoryMap, getTitle, parseDate, normalizeSlug, adaptImageUrl } from "./sharedUtils.js";

const md = markdownit({ html: true });

// Rule to adapt image URLs in markdown content
const defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const srcIndex = token.attrIndex("src");
    if (srcIndex >= 0) {
        token.attrs[srcIndex][1] = adaptImageUrl(token.attrs[srcIndex][1]);
    }
    return defaultImageRender(tokens, idx, options, env, self);
};

function calculateReadingTime(text, wpm = 238, roundUp = true) {
    if (!text || typeof text !== "string") return 0;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    let timeInMinutes = wordCount / wpm;
    return roundUp ? Math.ceil(timeInMinutes) : Math.floor(timeInMinutes);
}

// Re-implementing renderTemplate since it's not exported from basic-ssg
async function renderTemplateLocal(inputPath, outputPath, data = {}) {
    const fileName = path.basename(outputPath, ".html");
    const renderData = { ...data, fileName };
    return new Promise((res, rej) => {
        renderFile(inputPath, renderData, async (error, html) => {
            if (error) {
                rej(error);
                return;
            }
            try {
                const dirname = path.dirname(outputPath);
                await mkdir(dirname, { recursive: true });
                await writeFile(outputPath, html, { encoding: "utf-8" });
                res(true);
            } catch (e) {
                rej(e);
            }
        });
    });
}

async function getFlexiblePageData(globPath) {
    const { default: fg } = await import("fast-glob");
    const posts = await fg(globPath, { onlyFiles: true });
    return Promise.all(posts.map(async (post) => {
        const fileContents = await readFile(post, "utf-8");
        const stats = await stat(post, { bigint: false });
        const { data, content } = matter(fileContents);
        // Apply image adaptation to the body content BEFORE rendering
        const adaptedContent = content.replace(/(!\[.*?\]\()(.+?)(\))/g, (match, p1, p2, p3) => {
            return p1 + adaptImageUrl(p2) + p3;
        });
        const htmlContent = md.render(adaptedContent);
        const slug = normalizeSlug(path.basename(post, ".md"));
        
        // Derive breadcrumbs from directory structure
        const relativePath = path.relative("pages/blog/posts", post);
        const parts = path.dirname(relativePath).split(path.sep).filter(p => p !== ".");
        
        const breadcrumbs = [
            { label: 'Início', url: '/blog' }
        ];

        let cumulativePath = "/blog";
        for (const part of parts) {
            cumulativePath += `/${part}`;
            breadcrumbs.push({
                label: getTitle(part),
                url: cumulativePath
            });
        }

        const categorySlug = parts.length > 0 ? parts[parts.length - 1] : "blog";
        const categoryTitle = getTitle(categorySlug);

        const dateObj = parseDate(data.date);

        return {
            ...data,
            post: htmlContent,
            postUrl: slug,
            postName: data.title ?? slug,
            postDate: dateObj.getTime() > 0 ? dateObj.toLocaleDateString("pt-BR") : new Date(stats.birthtime).toLocaleDateString("pt-BR"),
            postAuthor: data.author ?? "Anonymous",
            postDescription: data.description ?? "",
            postTime: calculateReadingTime(content),
            coverImage: adaptImageUrl(data.coverImage ?? null),
            category: categoryTitle,
            categorySlug,
            categoryTitle,
            tags: data.tags || [],
            breadcrumbs: [...breadcrumbs, { label: data.title ?? slug, url: "" }]
        };
    }));
}

export const customBlogPlugin = (options = {}) => ({
    name: "custom-blog",
    setup: (cfg) => {
        const templatePath = options.templatePath || "pages/**/custom/blog.ejs";
        const mdPaths = options.mdPaths || "posts/**/*.md"; // Support nested folders
        
        return {
            beforeBuild: [
                {
                    glob: [templatePath],
                    fn: async function buildBlog(files, cfg) {
                        const { default: fg } = await import("fast-glob");
                        const templates = await fg(templatePath, { objectMode: true });
                        const postsBase = path.join("pages/blog", "posts");
                        const navTree = cfg.navTree || await buildNavTree(postsBase, postsBase);

                        return Promise.all(templates.map(async (entry) => {
                            const tplPath = entry.path;
                            const pageDir = path.dirname(path.dirname(tplPath)); // pages/blog
                            const pageName = path.basename(pageDir);
                            const postsGlob = path.join(pageDir, mdPaths);
                            const renderedPosts = await getFlexiblePageData(postsGlob);
                            
                            return Promise.all(renderedPosts.map((postData) => {
                                const outputPath = path.join(cfg.paths.dist, pageName, "articles", `${postData.postUrl}.html`);
                                return renderTemplateLocal(tplPath, outputPath, {
                                    ...postData,
                                    navTree,
                                    currentPath: `/blog/articles/${postData.postUrl}`
                                });
                            }));
                        }));
                    },
                },
            ],
        };
    },
});
