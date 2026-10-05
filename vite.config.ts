import path from "node:path";
import fs from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function mediaPersistencePlugin(): Plugin {
  return {
    name: "media-persistence-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split("?")[0];

        if (url === "/api/upload-media" && req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const raw = Buffer.concat(chunks).toString("utf-8");
              const { mediaId, projectId, dataUrl } = JSON.parse(raw);

              if (!mediaId || !dataUrl) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing mediaId or dataUrl" }));
                return;
              }

              // Extract mime and base64
              const matches = dataUrl.match(/^data:([A-Za-z+-/]+);base64,(.+)$/);
              let buffer: Buffer;
              let ext = "jpg";

              if (matches && matches.length === 3) {
                const mime = matches[1];
                if (mime.includes("png")) ext = "png";
                else if (mime.includes("webp")) ext = "webp";
                else if (mime.includes("gif")) ext = "gif";
                else if (mime.includes("mp4")) ext = "mp4";
                else ext = "jpg";
                buffer = Buffer.from(matches[2], "base64");
              } else {
                buffer = Buffer.from(dataUrl, "utf-8");
              }

              const safeProject = (projectId || "general").replace(/[^a-zA-Z0-9_-]/g, "_");
              const safeMedia = String(mediaId).replace(/[^a-zA-Z0-9_-]/g, "_");
              const fileName = `${safeProject}_${safeMedia}.${ext}`;

              const targetDirPublic = path.resolve(process.cwd(), "public/images/projects/uploaded");
              if (!fs.existsSync(targetDirPublic)) {
                fs.mkdirSync(targetDirPublic, { recursive: true });
              }
              const filePathPublic = path.join(targetDirPublic, fileName);
              fs.writeFileSync(filePathPublic, buffer);

              // Also write to dist if dist exists
              const targetDirDist = path.resolve(process.cwd(), "dist/images/projects/uploaded");
              if (fs.existsSync(path.resolve(process.cwd(), "dist"))) {
                if (!fs.existsSync(targetDirDist)) {
                  fs.mkdirSync(targetDirDist, { recursive: true });
                }
                fs.writeFileSync(path.join(targetDirDist, fileName), buffer);
              }

              const publicUrl = `/images/projects/uploaded/${fileName}`;

              // Update public/project-media-store.json & src/data/project-media-store.json
              const storePaths = [
                path.resolve(process.cwd(), "public/project-media-store.json"),
                path.resolve(process.cwd(), "src/data/project-media-store.json"),
              ];

              let currentStore: Record<string, string> = {};
              if (fs.existsSync(storePaths[0])) {
                try {
                  currentStore = JSON.parse(fs.readFileSync(storePaths[0], "utf-8"));
                } catch {
                  currentStore = {};
                }
              }
              currentStore[mediaId] = publicUrl;

              const aliasMap: Record<string, string[]> = {
                "project-01-hero": ["cr-launch-01", "country-rolls-hero"],
                "cr-launch-01": ["project-01-hero", "country-rolls-hero"],
                "country-rolls-hero": ["project-01-hero", "cr-launch-01"],
                "project-02-hero": ["sn-launch-01", "shree-nandis-hero"],
                "sn-launch-01": ["project-02-hero", "shree-nandis-hero"],
                "shree-nandis-hero": ["sn-launch-01", "project-02-hero"],
                "project-03-hero": ["cc-relaunch-01", "coffee-co-hero"],
                "cc-relaunch-01": ["project-03-hero", "coffee-co-hero"],
                "coffee-co-hero": ["cc-relaunch-01", "project-03-hero"],
                "project-04-hero": ["crp-lineup-01", "creators-raipur-hero"],
                "crp-lineup-01": ["project-04-hero", "creators-raipur-hero"],
                "creators-raipur-hero": ["project-04-hero", "crp-lineup-01"],
                "lab-01": ["content-01"],
                "content-01": ["lab-01"],
                "lab-02": ["content-02"],
                "content-02": ["lab-02"],
                "lab-03": ["content-03"],
                "content-03": ["lab-03"],
              };

              if (aliasMap[mediaId]) {
                for (const alias of aliasMap[mediaId]) {
                  currentStore[alias] = publicUrl;
                }
              }

              for (const p of storePaths) {
                fs.writeFileSync(p, JSON.stringify(currentStore, null, 2), "utf-8");
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, url: publicUrl, mediaId }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        if (url === "/api/project-media" && req.method === "GET") {
          const storePath = path.resolve(process.cwd(), "public/project-media-store.json");
          let data = {};
          if (fs.existsSync(storePath)) {
            try {
              data = JSON.parse(fs.readFileSync(storePath, "utf-8"));
            } catch {
              data = {};
            }
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return;
        }

        if (url === "/api/delete-media" && req.method === "POST") {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const raw = Buffer.concat(chunks).toString("utf-8");
              const { mediaId } = JSON.parse(raw);
              const storePaths = [
                path.resolve(process.cwd(), "public/project-media-store.json"),
                path.resolve(process.cwd(), "src/data/project-media-store.json"),
              ];
              let currentStore: Record<string, string> = {};
              if (fs.existsSync(storePaths[0])) {
                try {
                  currentStore = JSON.parse(fs.readFileSync(storePaths[0], "utf-8"));
                } catch {
                  currentStore = {};
                }
              }
              if (mediaId && currentStore[mediaId]) {
                delete currentStore[mediaId];
                for (const p of storePaths) {
                  fs.writeFileSync(p, JSON.stringify(currentStore, null, 2), "utf-8");
                }
              }
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: String(err) }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/Portfolio-2/",
  plugins: [
    react(),
    tailwindcss(),
    mediaPersistencePlugin(),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: /^lucide-react$/, replacement: path.resolve(__dirname, "./src/lib/lucide-react.tsx") },
      { find: "lucide-react-upstream", replacement: path.resolve(__dirname, "./node_modules/lucide-react") },
      { find: /^recharts$/, replacement: path.resolve(__dirname, "./src/lib/recharts.tsx") },
      { find: "recharts-upstream", replacement: path.resolve(__dirname, "./node_modules/recharts") },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    cors: true,
  },
}));
