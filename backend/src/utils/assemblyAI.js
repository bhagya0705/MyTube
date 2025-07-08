import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const BASE_URL = "https://api.assemblyai.com/v2";

export const transcribeAndSummarizeWithAssemblyAI = async (audioPath) => {
  try {
    const audioUrl = await uploadAudioFile(audioPath);
    if (!audioUrl) throw new Error("❌ No audio URL returned from upload");
    console.log("✅ Audio URL:", audioUrl);

    const transcriptId = await startTranscription(audioUrl);
    console.log("🆔 Transcript ID:", transcriptId);

    const summary = await pollTranscription(transcriptId);
    return summary;
  } catch (err) {
    console.error("❌ AssemblyAI error:", err.response?.data || err.message);
    throw err;
  }
};

const uploadAudioFile = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);

  const res = await axios.post(`${BASE_URL}/upload`, fileStream, {
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
      "transfer-encoding": "chunked",
    },
  });

  return res.data.upload_url;
};

const startTranscription = async (audioUrl) => {
  console.log("📤 Starting transcription for:", audioUrl);

  const res = await axios.post(
    `${BASE_URL}/transcript`,
    {
      audio_url: audioUrl,
      summarization: true,
      summary_type: "bullets",
      summary_model: "informative",

    },
    {
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
    }
  );

  return res.data.id;
};

const pollTranscription = async (transcriptId) => {
  const pollingEndpoint = `${BASE_URL}/transcript/${transcriptId}`;
  let status = "queued";

  while (status !== "completed" && status !== "error") {
    const res = await axios.get(pollingEndpoint, {
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
      },
    });

    status = res.data.status;
    console.log("⏳ Polling Status:", status);

    if (status === "completed") {
      console.log("📝 Full Transcript:", res.data.text); // Add this
      console.log("📌 Summary Returned:", res.data.summary); // Add this

    }

    if (status === "error") {
      throw new Error("Transcription failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};
