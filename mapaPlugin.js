import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { renderFile } from "ejs";
import { buildNavTree, normalizeSlug } from "./sharedUtils.js";

async function renderTemplateLocal(inputPath, outputPath, data = {}) {
    return new Promise((res, rej) => {
        renderFile(inputPath, { ...data, filename: inputPath }, async (error, html) => {
            if (error) {
                rej(error);
                return;
            }
            try {
                const dirname = path.dirname(outputPath);
                await fs.mkdir(dirname, { recursive: true });
                await fs.writeFile(outputPath, html, { encoding: "utf-8" });
                res(true);
            } catch (e) {
                rej(e);
            }
        });
    });
}

export const mapaPlugin = (options = {}) => ({
    name: "mapa-plugin",
    setup: (cfg) => {
        const sourceDir = options.sourceDir || "pages/blog/mapas";
        const templatePath = options.templatePath || "templates/blog/map-detail.ejs";
        const outputDir = options.outputDir || "blog/mapas";
        const indexTemplatePath = "templates/blog/map-index.ejs";

        return {
            beforeBuild: [
                {
                    glob: [path.join(sourceDir, "*.md")],
                    fn: async function buildMapas(files, cfg) {
                        const { default: fg } = await import("fast-glob");
                        const mdFiles = await fg(path.join(process.cwd(), sourceDir, "*.md"));
                        
                        const mapsData = await Promise.all(mdFiles.map(async (file) => {
                            const content = await fs.readFile(file, "utf-8");
                            const { data, content: body } = matter(content);
                            const slug = normalizeSlug(path.basename(file, ".md"));
                            
                            return {
                                ...data,
                                slug,
                                rawContent: body,
                                url: `/blog/mapas/${slug}`,
                                title: data.title || slug
                            };
                        }));

                        // Shared global data for other plugins (like categoryPlugin's search index)
                        cfg.navMapas = mapsData;

                        const postsBase = path.join(process.cwd(), "pages/blog/posts");
                        const navTree = cfg.navTree || await buildNavTree(postsBase, postsBase);
                        
                        // 1. Generate the individual map pages
                        const fullTemplatePath = path.resolve(process.cwd(), templatePath);
                        await Promise.all(mapsData.map(async (map) => {
                            const outputPath = path.join(cfg.paths.dist, outputDir, `${map.slug}.html`);
                            return renderTemplateLocal(fullTemplatePath, outputPath, {
                                ...map,
                                currentPath: map.url,
                                navMapas: cfg.navMapas || mapsData,
                                navTree: navTree
                            });
                        }));

                        // 1.5 Generate the Mapas Mentais Index Page explicitly
                        const indexInputPath = path.join(process.cwd(), indexTemplatePath);
                        const indexOutputPath = path.join(cfg.paths.dist, outputDir, "index.html");
                        if (await fs.stat(indexInputPath).catch(() => false)) {
                            await renderTemplateLocal(indexInputPath, indexOutputPath, {
                                navMapas: cfg.navMapas || mapsData,
                                navTree: navTree,
                                currentPath: `/${outputDir}`
                            });
                        }

                        // 2. Generate the nav data partial for the sidebar
                        const componentsDir = path.join("pages", "blog", "components");
                        await fs.mkdir(componentsDir, { recursive: true });
                        const navDataContent = `<% locals.navMapas = ${JSON.stringify(mapsData)}; %>`;
                        const navDataPath = path.join(componentsDir, "_mapas-nav-data.ejs");
                        
                        // Only write if changed to avoid unnecessary re-triggers in watch mode
                        const existingContent = await fs.readFile(navDataPath, "utf-8").catch(() => "");
                        if (existingContent !== navDataContent) {
                            await fs.writeFile(navDataPath, navDataContent);
                        }
                    },
                },
            ],
        };
    },
});
