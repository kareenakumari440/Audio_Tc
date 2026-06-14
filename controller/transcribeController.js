const busboy = require("busboy");
require("dotenv").config();

const transcribe = async (req, res) => {
  try {
    console.log("header:", req.headers);

    const bb = busboy({
      headers: req.headers,
    });

    bb.on("file", (fieldname, file, info) => {
      console.log("file received fieldname:", fieldname);
      console.log("file received info:", info);

      const chunks = [];

      file.on("data", (chunk) => {
        console.log("chunk received:", chunk.length);
        chunks.push(chunk);
      });

      file.on("end", async () => {
        try {
          console.log("FILE END TRIGGERED");

          const audioBuffer = Buffer.concat(chunks);

          console.log("Audio size:", audioBuffer.length);

          const response = await fetch(
            "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true",
            {
              method: "POST",
              headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": info.mimeType,
              },
              body: audioBuffer,
            }
          );

          console.log("Deepgram Status:", response.status);

          const data = await response.json();

          console.log("Deepgram Response:");
          console.dir(data, { depth: null });

          if (!response.ok) {
            return res.status(response.status).json({
              success: false,
              error: data,
            });
          }

          const transcript =
            data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

          return res.status(200).json({
            success: true,
            transcript,
          });
        } catch (error) {
          console.error("Deepgram Error:", error);

          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }
      });

      file.on("error", (err) => {
        console.error("File Stream Error:", err);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      });
    });

    bb.on("finish", () => {
      console.log("BUSBOY FINISHED");
    });

    bb.on("error", (err) => {
      console.error("Busboy Error:", err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });

    req.pipe(bb);
  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = transcribe;