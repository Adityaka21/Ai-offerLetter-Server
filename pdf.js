import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createOfferPDF(data) {
  return new Promise((resolve, reject) => {
    try {
      // Documents folder (same level as pdf.js)
      const folderPath = path.join(__dirname, "documents");

      // Create folder if not exists
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const fileName = `offer-letter-${Date.now()}.pdf`;
      const filePath = path.join(folderPath, fileName);

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* HEADER */
      const logoPath = path.join(__dirname, "logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 250, 30, { width: 80 });
      }

      doc.rect(0, 130, 612, 30).fill("#1f3c88");

      doc
        .fillColor("white")
        .fontSize(10)
        .text(
          `${data.company} | ${data.location}`,
          50,
          138,
          { align: "center" }
        );

      doc.moveDown(4);
      doc.fillColor("black");

      /* TITLE */
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("INDIA JOB OFFER LETTER", { align: "center" });

      doc.moveDown(2);

      /* DATE & ADDRESS */
      doc.fontSize(11).font("Helvetica");
      doc.text(`Date: ${new Date().toDateString()}`);
      doc.moveDown(1);
      doc.text(data.name);
      doc.text(data.location);

      doc.moveDown(2);

      /* BODY */
      doc.text(`Dear ${data.name},`);
      doc.moveDown(1);

      doc.text(
        `We are pleased to offer you the position of ${data.role} at ${data.company}. Your primary work location will be ${data.location}. Your expected date of joining is ${data.joiningDate}.`
      );

      doc.moveDown(1.5);
      doc.font("Helvetica-Bold").text("Compensation");
      doc.font("Helvetica").text(
        `Your gross monthly salary will be ${data.salary}. Applicable statutory deductions shall apply.`
      );

      doc.moveDown(1.5);
      doc.font("Helvetica-Bold").text("Probation");
      doc.font("Helvetica").text(
        `Probation period will be ${data.probation}.`
      );

      doc.moveDown(1.5);
      doc.font("Helvetica-Bold").text("Notice Period");
      doc.font("Helvetica").text(
        `Notice period applicable will be ${data.notice}.`
      );

      doc.moveDown(1.5);
      doc.font("Helvetica-Bold").text("Governing Law");
      doc.font("Helvetica").text(
        `This employment shall be governed by the laws of India.`
      );

      doc.moveDown(2);
      doc.text("Yours sincerely,");
      doc.font("Helvetica-Bold").text(`For ${data.company}`);
      doc.text("Human Resources");

      doc.moveDown(3);
      doc.font("Helvetica-Bold").text("Acceptance");
      doc.font("Helvetica").text(
        `I, ${data.name}, accept this offer of employment.`
      );

      doc.end();

      // Resolve only after file is fully written
      stream.on("finish", () => resolve(fileName));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}
