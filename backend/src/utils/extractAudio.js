import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

// 👇 Add this line if ffmpeg is in a local directory
ffmpeg.setFfmpegPath("C:/Users/BHAGYA/Downloads/ffmpeg-7.1.1-essentials_build/ffmpeg-7.1.1-essentials_build/bin/ffmpeg.exe");

/**
 * Extracts audio from a video file and saves it as .mp3 in /public/temp
 */
export const extractAudioFromVideo = (inputPath, filename) => {
  return new Promise((resolve, reject) => {
    const tempDir = path.resolve("public", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const outputPath = path.join(tempDir, `${filename}.mp3`);

    ffmpeg(inputPath)
      .noVideo()
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("start", (cmd) => console.log("FFmpeg started:", cmd)) // ✅ Add logging
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg error:", err.message);
        reject(err);
      })
      .save(outputPath);
  });
};
