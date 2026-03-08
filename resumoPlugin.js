import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";

export const resumoPlugin = () => ({
  name: "resumo-plugin",
  setup: (cfg) => ({
    afterBuild: [
      {
        glob: ["pages/blog/resumo/*.html"],
        fn: async (files, ssgConfig) => {
          const sourceDir = path.resolve(process.cwd(), "pages/blog/resumo");
          const targetDir = path.resolve(process.cwd(), ssgConfig.paths.dist, "blog");

          if (!fs.existsSync(sourceDir)) {
            console.warn(`[resumo-plugin] Source directory ${sourceDir} does not exist.`);
            return;
          }

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const htmlFiles = await fg("*.html", { cwd: sourceDir });

          for (const file of htmlFiles) {
            const srcPath = path.join(sourceDir, file);
            const destPath = path.join(targetDir, file);
            
            try {
              fs.copyFileSync(srcPath, destPath);
              console.log(`[resumo-plugin] Copied ${file} to ${ssgConfig.paths.dist}/blog/`);
            } catch (err) {
              console.error(`[resumo-plugin] Copy failed: ${err.message}`);
            }
          }
        },
      },
    ],
  }),
});
