import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function createJoiningPDF(data) {
  return new Promise((resolve) => {
    const folderPath = path.join(process.cwd(), "documents");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const fileName = `joining-letter-${Date.now()}.pdf`;
    const filePath = path.join(folderPath, fileName);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    if (fs.existsSync("logo.png")) {
      doc.image("logo.png", 250, 30, { width: 80 });
    }

    doc.rect(0, 130, 612, 30).fill("#1f3c88");
    doc.fillColor("white").fontSize(10).text(
      `${data.company} | ${data.location}`,
      50,
      138,
      { align: "center" }
    );

    doc.moveDown(4).fillColor("black");

    doc.fontSize(18).font("Helvetica-Bold")
      .text("JOINING LETTER", { align: "center" });

    doc.moveDown(2);
    doc.fontSize(11).text(`Date: ${new Date().toDateString()}`);
    doc.moveDown(1);
    doc.text(data.name);
    doc.text(data.location);

    doc.moveDown(2);
    doc.text(`Dear ${data.name},`);
    doc.moveDown(1);

    doc.text(
      `This letter confirms your joining with ${data.company} as ${data.role} at ${data.location} effective ${data.joiningDate}.`
    );

    doc.moveDown(1.5);
    doc.text(
      `You will report to the Head of Operations or any authority designated by the Company.`
    );

    doc.moveDown(1.5);
    doc.text(
      `We welcome you to ${data.company} and wish you a successful association.`
    );

    doc.moveDown(2);
    doc.text("Yours sincerely,");
    doc.font("Helvetica-Bold").text(`For ${data.company}`);
    doc.text("Human Resources");

    doc.moveDown(3);
    doc.font("Helvetica-Bold").text("Acknowledgement");
    doc.font("Helvetica").text(
      `I, ${data.name}, acknowledge receipt of this joining letter.`
    );

    doc.end();
    resolve(fileName);
  });
}
