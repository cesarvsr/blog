import fs from "node:fs";
import path from "node:path";
import { default as fg } from "fast-glob";
import matter from "gray-matter";

// Predefined category slug to title mapping
export const categoryMap = {
    "clinica-medica": { title: "Clínica Médica", description: "Medicina baseada em evidências." },
    "obstetricia": { title: "Obstetrícia", description: "Cuidado materno-fetal avançado." },
    "cardiologia": { title: "Cardiologia", description: "Saúde cardiovascular e exames." },
    "endocrinologia": { title: "Endocrinologia", description: "Distúrbios hormonais e metabólicos." },
    "pediatria": { title: "Pediatria", description: "Cuidados pediátricos e neonatais." }
};

export const normalizeSlug = (str) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .toLowerCase()
        .replace(/\s+/g, "-") // Spaces to hyphens
        .replace(/[^a-z0-9-]/g, "") // Remove non-alfanumeric (except hyphens)
        .replace(/-+/g, "-") // Collapse hyphens
        .replace(/^-+|-+$/g, ""); // Trim hyphens
};

export const parseDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return new Date(0);
    // Handle DD/MM/YYYY
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
    }
    // Fallback to native
    const n = new Date(dateStr);
    return isNaN(n.getTime()) ? new Date(0) : n;
};

export const getTitle = (slug) => {
    if (categoryMap[slug]) return categoryMap[slug].title;
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};


export const getPageData = async (globPattern) => {
    const files = await fg(globPattern, { objectMode: true });
    return files.map(file => {
        const content = fs.readFileSync(file.path, "utf-8");
        const { data } = matter(content);
        const slug = normalizeSlug(path.basename(file.path, ".md"));
        
        return {
            title: data.title || getTitle(slug),
            date: data.date || "",
            url: `/blog/articles/${slug}`,
            slug: slug,
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
            const normalizedName = normalizeSlug(entry.name);
            const children = await buildNavTree(fullPath, baseDir);
            if (children.length > 0) {
                items.push({
                    type: "folder",
                    name: normalizedName,
                    title: getTitle(normalizedName),
                    path: relativePath,
                    url: `/blog/${relativePath}`,
                    children
                });
            }
        } else if (entry.name.endsWith(".md")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const { data } = matter(content);
            const slug = normalizeSlug(path.basename(entry.name, ".md"));
            
            items.push({
                type: "post",
                name: entry.name,
                title: data.title || getTitle(slug),
                path: relativePath,
                url: `/blog/articles/${slug}`,
                slug: slug,
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
            const normalizedName = normalizeSlug(entry.name);
            const children = buildNavTreeSync(fullPath, baseDir);
            if (children.length > 0) {
                items.push({
                    type: "folder",
                    name: normalizedName,
                    title: getTitle(normalizedName),
                    path: relativePath,
                    url: `/blog/${relativePath}`,
                    children
                });
            }
        } else if (entry.name.endsWith(".md")) {
            const content = fs.readFileSync(fullPath, "utf-8");
            const { data } = matter(content);
            const slug = normalizeSlug(path.basename(entry.name, ".md"));
            
            items.push({
                type: "post",
                name: entry.name,
                title: data.title || getTitle(slug),
                path: relativePath,
                url: `/blog/articles/${slug}`,
                slug: slug,
                date: data.date || "",
                description: data.description || "",
                coverImage: data.coverImage || null,
                tags: data.tags || []
            });
        }
    }
    return items.sort((a, b) => (a.type === "folder" ? -1 : 1));
}
