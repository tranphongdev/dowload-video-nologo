import express from "express";
import { createServer as createViteServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import cors from "cors";
import fs from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "history.json");

async function ensureDBExists() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(DB_PATH);
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify([]));
    }
  } catch (err) {
    console.error("Failed to ensure DB exists:", err);
  }
}

async function readHistoryDB() {
  await ensureDBExists();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read DB:", err);
    return [];
  }
}

async function writeHistoryDB(data: any[]) {
  await ensureDBExists();
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write to DB:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/download", async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Using tikwm.com API as a proxy/helper
      const response = await axios.get(`https://www.tikwm.com/api/`, {
        params: { url: url }
      });

      const data = response.data;
      
      if (data.code !== 0) {
        return res.status(500).json({ error: data.msg || "Failed to fetch video details" });
      }

      // Return relevant data to client
      // data.data contains video url, cover, author, etc.
      res.json({
        id: data.data.id,
        title: data.data.title,
        cover: data.data.cover,
        origin_url: data.data.origin_url,
        play_url: data.data.play, // Unwatermarked video
        hd_play_url: data.data.hdplay, // HD Unwatermarked video
        music_url: data.data.music,
        images: data.data.images, // Support for photo slides
        author: {
            nickname: data.data.author.nickname,
            avatar: data.data.author.avatar,
            unique_id: data.data.author.unique_id
        }
      });
    } catch (error: any) {
      console.error("API Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/proxy", async (req, res) => {
    const { url, filename } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).send("URL required");
    }

    try {
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const contentTypeRaw = response.headers["content-type"];
      const contentType = typeof contentTypeRaw === "string" ? contentTypeRaw : "video/mp4";
      const extension = contentType.includes("/") ? contentType.split("/")[1] : "mp4";
      const actualFilename = filename || `video_${Date.now()}.${extension}`;

      res.setHeader("Content-Disposition", `attachment; filename="${actualFilename}"`);
      res.setHeader("Content-Type", contentType);

      response.data.pipe(res);
    } catch (error: any) {
      console.error("Proxy Error:", error.message);
      res.status(500).send("Failed to proxy download");
    }
  });

  app.get("/api/history", async (req, res) => {
    try {
      const history = await readHistoryDB();
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: "Failed to load history" });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const item = req.body;
      if (!item || !item.id) {
        return res.status(400).json({ error: "Invalid video data" });
      }

      const history = await readHistoryDB();
      const filtered = history.filter((x: any) => x.id !== item.id);
      
      const newItem = {
        ...item,
        timestamp: Date.now()
      };

      const updated = [newItem, ...filtered].slice(0, 24);
      await writeHistoryDB(updated);
      res.json(newItem);
    } catch (err) {
      res.status(500).json({ error: "Failed to save to history" });
    }
  });

  app.delete("/api/history", async (req, res) => {
    try {
      await writeHistoryDB([]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to clear history" });
    }
  });

  app.delete("/api/history/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const history = await readHistoryDB();
      const updated = history.filter((x: any) => x.id !== id);
      await writeHistoryDB(updated);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete history item" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "."),
        },
      },
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
