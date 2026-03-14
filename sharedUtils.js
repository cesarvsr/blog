import fs from "node:fs";
import path from "node:path";
import { default as fg } from "fast-glob";
import matter from "gray-matter";

// Predefined category slug to title mapping
export const categoryMap = {
    "clinica-medica": { title: "Clínica Médica", description: "Medicina baseada em evidências." },
    "obstetricia": { title: "Obstetrícia", description: "Cuidado materno-fetal avançado." },
    "cardiologia": { title: "Cardiologia", description: "Saúde cardiovascular e exames." }
};

export const getTitle = (slug) => {
    if (categoryMap[slug]) return categoryMap[slug].title;
    return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

function logDebug(msg) {
    try {
        fs.appendFileSync(path.join(process.cwd(), "debug-shared-utils.log"), msg + "\n");
    } catch (e) {}
}

export const getPageData = async (globPattern) => {
    const files = await fg(globPattern, { objectMode: true });
    return files.map(file => {
        const content = fs.readFileSync(file.path, "utf-8");
        const { data } = matter(content);
        logDebug(`getPageData: ${file.path} -> ${data.title}`);
        return {
            title: data.title || getTitle(path.basename(file.path, ".md")),
            date: data.date || "",
            url: `/blog/articles/${path.basename(file.path, ".md")}`,
            slug: path.basename(file.path, ".md"),
            description: data.description || "",
            coverImage: data.coverImage || null,
            tags: data.tags || []
        };
    });
};

/**
 * Builds a hierarchical navigation tree from the posts directory.
 */
export async function buildNavTree(currentDir, baseDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const items = [];

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
            const children = await buildNavTree(fullPath, baseDir);
            if (children.length > 0) {
                items.push({
                    type: "folder",
                    name: entry.name,
                    title: getTitle(entry.name),
                    path: relativePath,
                    url: `/blog/${relativePath}`,
                    children
                });
            }
        } else if (entry.name.endsWith(".md")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const { data } = matter(content);
            logDebug(`buildNavTree: ${fullPath} -> ${data.title}`);
            items.push({
                type: "post",
                name: entry.name,
                title: data.title || getTitle(path.basename(entry.name, ".md")),
                path: relativePath,
                url: `/blog/articles/${path.basename(entry.name, ".md")}`,
                slug: path.basename(entry.name, ".md"),
                date: data.date || "",
                description: data.description || "",
                coverImage: data.coverImage || null,
                tags: data.tags || []
            });
        }
    }
    return items.sort((a, b) => (a.type === "folder" ? -1 : 1));
}

/**
 * Synchronous version of buildNavTree for use in setup/EJS
 */
export function buildNavTreeSync(currentDir, baseDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const items = [];

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
            const children = buildNavTreeSync(fullPath, baseDir);
            if (children.length > 0) {
                items.push({
                    type: "folder",
                    name: entry.name,
                    title: getTitle(entry.name),
                    path: relativePath,
                    url: `/blog/${relativePath}`,
                    children
                });
            }
        } else if (entry.name.endsWith(".md")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const { data } = matter(content);
            items.push({
                type: "post",
                name: entry.name,
                title: data.title || getTitle(path.basename(entry.name, ".md")),
                path: relativePath,
                url: `/blog/articles/${path.basename(entry.name, ".md")}`,
                slug: path.basename(entry.name, ".md"),
                date: data.date || "",
                description: data.description || "",
                coverImage: data.coverImage || null,
                tags: data.tags || []
            });
        }
    }
    return items.sort((a, b) => (a.type === "folder" ? -1 : 1));
}
