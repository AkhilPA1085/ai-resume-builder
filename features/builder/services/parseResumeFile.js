import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

PDFParse.setWorker(getPath());

export const parseResumeFile = async (file) => {
    console.log("fileType123", file?.type)
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("fileType", file?.type)

        if (file?.type === 'application/pdf') {
            const parser = new PDFParse({ data: buffer });   // ✅ instantiate with `new`
            const result = await parser.getText();            // ✅ separate method call
            await parser.destroy();                            // ✅ cleans up internal resources
            return result.text;
        }

        if (file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer });
            return value;
        }
         throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
    } catch (error) {
        console.log('error', error)
        throw new Error("Unsupported file type. Please upload PDF or DOCX file")
    }
}