import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(`https://www.tikwm.com/api/`, {
      params: { url: url }
    });

    const data = response.data;
    
    if (data.code !== 0) {
      return res.status(500).json({ error: data.msg || "Failed to fetch video details" });
    }

    res.json({
      id: data.data.id,
      title: data.data.title,
      cover: data.data.cover,
      origin_url: data.data.origin_url,
      play_url: data.data.play,
      hd_play_url: data.data.hdplay,
      music_url: data.data.music,
      images: data.data.images,
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

export default app;
