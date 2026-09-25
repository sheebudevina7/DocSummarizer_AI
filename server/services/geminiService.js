import { GoogleGenAI } from '@google/genai';

/**
 * Execute an async function with a max timeout
 */
const fetchWithTimeout = (promise, ms = 90000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Gemini API request timed out. Please try again.'));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateGeminiSummary = async (inputData, isFile = false, mimeType = 'text/plain') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in backend .env file');
  }

  const ai = new GoogleGenAI({ apiKey });
  const targetModel = 'gemini-3.8-flash';

  let contents = [];

  if (isFile) {
    const base64Data = inputData.toString('base64');
    contents = [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'application/pdf',
              data: base64Data,
            },
          },
          {
            text: 'Provide a concise, clear, and well-structured summary of this uploaded document.',
          },
        ],
      },
    ];
  } else {
    const cleanText = typeof inputData === 'string' ? inputData : String(inputData || '');
    contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Provide a concise, clear, and well-structured summary of the following content:\n\n${cleanText}`,
          },
        ],
      },
    ];
  }

  const maxRetries = 4;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini API] Dispatching request (Attempt ${attempt}/${maxRetries})...`);

      const response = await fetchWithTimeout(
        ai.models.generateContent({
          model: targetModel,
          contents: contents,
        }),
        90000
      );

      let extractedText = '';
      if (typeof response.text === 'string') extractedText = response.text;
      else if (typeof response.text === 'function') extractedText = response.text();
      else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        extractedText = response.candidates[0].content.parts[0].text;
      } else {
        extractedText = String(response);
      }

      if (extractedText && extractedText.trim()) {
        console.log('[Gemini API] Summary generated successfully!');
        return extractedText;
      }
    } catch (error) {
      lastError = error;
      const errorStr = String(error?.message || error);
      const is503 = error?.status === 503 || errorStr.includes('503') || errorStr.includes('high demand') || errorStr.includes('UNAVAILABLE');

      console.warn(`[Gemini API] Attempt ${attempt} failed: ${errorStr}`);

      if (is503 && attempt < maxRetries) {
        // Wait 4s, 8s, 12s on retries to let Google's capacity clear
        const waitMs = attempt * 4000;
        console.log(`Google servers busy (503). Retrying in ${waitMs / 1000} seconds...`);
        await sleep(waitMs);
      } else {
        break;
      }
    }
  }

  throw new Error('Google AI servers are currently experiencing high traffic (503). Please wait 30 seconds and try clicking generate again.');
};

export const generateSummaryFromText = (text) => generateGeminiSummary(text, false);