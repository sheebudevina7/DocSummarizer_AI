import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/summaries',
});


export const summarizeText = async (text) => {
  const response = await API.post('/summarize-text', { text });
  return response.data;
};

export const summarizeFile = async (formData) => {
  const response = await API.post('/summarize-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await API.get('/');
  return response.data;
};

// Added alias so History.jsx finds getSummaries without errors
export const getSummaries = getHistory;

export const deleteSummary = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};