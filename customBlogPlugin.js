import fg from "fast-glob";
import path from "node:path";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import markdownit from "markdown-it";
import matter from "gray-matter";
import { renderFile } from "ejs";

const md = markdownit({ html: true });

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

const categoryMap = {
    "clinica-medica": "Clínica Médica",
    "cirurgia": "Cirurgia",
    "pediatria": "Pediatria",
    "ginecologia": "Ginecologia & Obstetrícia"
};

async function getFlexiblePageData(globPath) {
    const posts = await fg(globPath, { onlyFiles: true });
    return Promise.all(posts.map(async (post) => {
        const fileContents = await readFile(post, "utf-8");
        const stats = await stat(post, { bigint: false });
        const { data, content } = matter(fileContents);
        const htmlContent = md.render(content);
        const fileName = path.basename(post, ".md");
        
        // Derive category from directory structure
        // path looks like: pages/blog/posts/clinica-medica/article.md
        const pathParts = path.dirname(post).split(path.sep);
        const categorySlug = pathParts[pathParts.length - 1];
        const categoryTitle = categoryMap[categorySlug] || (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '));

        return {
            ...data,
            post: htmlContent,
            postUrl: fileName.toLowerCase().replace(/\s+/g, "-"),
            postName: data.title ?? fileName,
            postDate: (data.date instanceof Date) ? data.date.toLocaleDateString("pt-BR") : (data.date ?? new Date(stats.birthtime).toLocaleDateString("pt-BR")),
            postAuthor: data.author ?? "Anonymous",
            postDescription: data.description ?? "",
            postTime: calculateReadingTime(content),
            coverImage: data.coverImage ?? null,
            categorySlug,
            categoryTitle
        };
    }));
}

export const customBlogPlugin = (options = {}) => ({
    name: "custom-blog",
    setup: (cfg) => {
        const templatePath = options.templatePath || "pages/**/custom/blog.ejs";
        const mdPaths = options.mdPaths || "posts/*.md";
        
        return {
            beforeBuild: [
                {
                    glob: [templatePath],
                    fn: async function buildBlog(files, cfg) {
                        const templates = await fg(templatePath, { objectMode: true });
                        return Promise.all(templates.map(async (entry) => {
                            const tplPath = entry.path;
                            const pageDir = path.dirname(path.dirname(tplPath));
                            const pageName = path.basename(pageDir);
                            const postsGlob = path.join(pageDir, mdPaths);
                            const renderedPosts = await getFlexiblePageData(postsGlob);
                            
                            return Promise.all(renderedPosts.map((postData) => {
                                const outputPath = path.join(cfg.paths.dist, pageName, "articles", `${postData.postUrl}.html`);
                                return renderTemplateLocal(tplPath, outputPath, postData);
                            }));
                        }));
                    },
                },
            ],
        };
    },
});
