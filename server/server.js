import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/summaries', summaryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});