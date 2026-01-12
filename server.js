import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createOfferPDF } from "./pdf.js";
import { createJoiningPDF } from "./joiningPdf.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve documents folder
app.use("/documents", express.static(path.join(__dirname, "documents")));


// OFFER LETTER
app.post("/generate-offer", async (req, res) => {
  try {
    const pdfFile = await createOfferPDF(req.body);
    res.json({ pdf: pdfFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Offer letter generation failed" });
  }
});

// JOINING LETTER
app.post("/generate-joining", async (req, res) => {
  try {
    const pdfFile = await createJoiningPDF(req.body);
    res.json({ pdf: pdfFile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Joining letter generation failed" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
