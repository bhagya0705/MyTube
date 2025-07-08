import fs from "fs";
import https from "https";

/**
 * Downloads a file from a URL to a local path
 */
export const downloadFile = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(outputPath));
      });
    }).on("error", (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
};