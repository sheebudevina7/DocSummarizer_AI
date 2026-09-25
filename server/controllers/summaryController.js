import { createRequire } from 'module';
import { generateGeminiSummary } from '../services/geminiService.js';
import Summary from '../models/Summary.js';

const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');

const extractPdfText = async (pdfBuffer) => {
  try {
    const parseFn = pdfParseLib.default || pdfParseLib;
    const data = await parseFn(pdfBuffer);
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
  } catch (err) {
    console.warn('pdf-parse text extraction skipped:', err.message);
  }
  return '';
};

export const summarizeTextHandler = async (req, res) => {
  try {
    const rawInput = req.body.text || req.body.originalText || req.body.inputText || req.body;
    const inputText = typeof rawInput === 'string' ? rawInput : String(rawInput || '');

    if (!inputText.trim()) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    console.log('Generating text summary...');
    const summaryResult = await generateGeminiSummary(inputText, false);

    const newSummary = await Summary.create({
      summaryText: summaryResult,
      summary: summaryResult,
      sourceType: 'text',
      originalText: inputText,
      text: inputText,
    });

    return res.status(200).json(newSummary);
  } catch (error) {
    console.error('summarizeTextHandler Error:', error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
};

export const summarizeFileHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Received file upload: ${req.file.originalname} (${req.file.mimetype})`);

    let summaryResult = '';
    let previewText = `[File: ${req.file.originalname}]`;

    if (req.file.mimetype === 'application/pdf') {
      const extractedText = await extractPdfText(req.file.buffer);

      if (extractedText && extractedText.trim().length > 50) {
        console.log(`Sending ${extractedText.length} extracted characters to Gemini...`);
        summaryResult = await generateGeminiSummary(extractedText, false);
        previewText = extractedText.substring(0, 500);
      } else {
        console.log('PDF contains scanned content or images. Sending raw buffer to Gemini...');
        summaryResult = await generateGeminiSummary(req.file.buffer, true, 'application/pdf');
      }
    } else {
      const fileText = req.file.buffer.toString('utf-8');
      const cleanText = fileText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').trim();

      // Check if file is NOT Word (.docx) before treating cleanText as readable string
      const isWordDoc = req.file.mimetype.includes('word') || req.file.originalname.endsWith('.docx') || req.file.originalname.endsWith('.doc');

      if (!isWordDoc && cleanText.length > 20) {
        console.log('Sending extracted document text to Gemini...');
        summaryResult = await generateGeminiSummary(cleanText, false);
        previewText = cleanText.substring(0, 500);
      } else {
        console.log('Sending raw file buffer directly to Gemini...');
        summaryResult = await generateGeminiSummary(req.file.buffer, true, req.file.mimetype || 'application/octet-stream');
      }
    }

    const newSummary = await Summary.create({
      summaryText: summaryResult,
      summary: summaryResult,
      sourceType: 'file',
      originalText: previewText,
      text: previewText,
    });

    return res.status(200).json(newSummary);
  } catch (error) {
    console.error('summarizeFileHandler Error:', error.message || error);
    return res.status(500).json({ error: error.message || 'Failed to process document file' });
  }
};

export const getHistoryHandler = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    return res.status(200).json(summaries);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const deleteSummaryHandler = async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete summary' });
  }
};