import express from 'express';
import multer from 'multer';
import {
  summarizeText,
  summarizeFile,
  getHistory,
  deleteSummary
} from '../controllers/summaryController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

router.post('/summarize-text', summarizeText);
router.post('/summarize-file', upload.single('file'), summarizeFile);
router.get('/', getHistoryHandler);
router.delete('/:id', deleteSummaryHandler);

export default router;