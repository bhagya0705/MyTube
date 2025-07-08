import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractAudioFromVideo } from "../utils/extractAudio.js";
import { transcribeAndSummarizeWithAssemblyAI } from "../utils/assemblyAI.js";

const summarizeVideo = asyncHandler(async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) throw new ApiError(400, "Video URL is required");

  // Step 1: Extract audio to /public/temp/audio-timestamp.mp3
  const audioPath = await extractAudioFromVideo(videoUrl, `audio-${Date.now()}`);
  console.log("✅ Audio saved at:", audioPath);

  // Step 2: Transcribe and summarize using AssemblyAI
  const summary = await transcribeAndSummarizeWithAssemblyAI(audioPath);
  console.log("✅ Summary:", summary);

  return res.status(200).json({ summary });
});

export { summarizeVideo };
