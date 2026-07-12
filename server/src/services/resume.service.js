import { PdfReader } from 'pdfreader';
import Resume from '../models/Resume.model.js';

/**
 * Parses text out of an uploaded PDF resume safely in Node.js
 * @param {Buffer} pdfBuffer 
 * @returns {Promise<string>} Extracted text
 */
export const parseResumePDF = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return reject(new Error('Buffer is empty or missing.'));
    }

    let extractedText = '';
    
    // Process the raw file buffer directly without any web workers or canvas components
    new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
      if (err) {
        console.error('PDF Parse Breakdown:', err.message);
        return reject(new Error('Failed to parse PDF. Please upload a valid PDF file.'));
      }
      
      // If item is undefined, the parser has reached the end of the document
      if (!item) {
        if (!extractedText || extractedText.trim().length === 0) {
          return reject(new Error('No text could be extracted from the PDF.'));
        }
        return resolve(extractedText.trim());
      }
      
      // If the parser hits text items, append them cleanly with space separation
      if (item.text) {
        extractedText += item.text + ' ';
      }
    });
  });
};

// --- Your exact original database functions remain untouched below ---
export const saveResume = async (userId, fileName, extractedText) => {
  const resume = await Resume.findOneAndUpdate(
    { userId },
    { userId, fileName, extractedText },
    { returnDocument: 'after', upsert: true }
  );
  return resume;
};

export const getUserResume = async (userId) => {
  const resume = await Resume.findOne({ userId }).select('-__v');
  return resume;
};