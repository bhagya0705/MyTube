import fs from "fs";
import axios from "axios";
import path from "path";

const ASSEMBLY_API_KEY = process.env.ASSEMBLYAI_API_KEY; // add in your .env

const transcribeAudio = async (audioPath) => {
  if (!fs.existsSync(audioPath)) throw new Error("Audio file not found");

  const uploadRes = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    fs.createReadStream(audioPath),
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        "transfer-encoding": "chunked",
      },
    }
  );

  const audioUrl = uploadRes.data.upload_url;

  const transcriptRes = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    { audio_url: audioUrl },
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        "content-type": "application/json",
      },
    }
  );

  const transcriptId = transcriptRes.data.id;

  // Polling for completion
  let completed = false;
  let transcriptText = "";

  while (!completed) {
    const checkRes = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      }
    );

    if (checkRes.data.status === "completed") {
      transcriptText = checkRes.data.text;
      completed = true;
    } else if (checkRes.data.status === "error") {
      throw new Error("Transcription failed: " + checkRes.data.error);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait before retry
    }
  }

  return transcriptText;
};

export { transcribeAudio };
