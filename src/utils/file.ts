import pdfParse from "pdf-parse";

export const extractTextFromFile = async (buffer: Buffer, mimetype: string) => {
  if (mimetype === "application/pdf") {
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (mimetype === "text/plain") {
    return buffer.toString("utf-8");
  }

  return null;
};
