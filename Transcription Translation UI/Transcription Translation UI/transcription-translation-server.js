const express = require('express');
const multer = require('multer');
const app = express();
const port = 8888;
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const OpenAIApi = require('openai');
const cors = require('cors')
require('dotenv').config();

// Parameters
const chatgpt_model = 'gpt-3.5-turbo';
const transcription_model = 'whisper-1';

async function transcribe_translate_file(filepath, language) {
    const OPEN_AI_KEY = process.env.OPENAI_API_KEY;
    const openai = await new OpenAIApi({
        apiKey: OPEN_AI_KEY,
    });

    async function transcribe(filepath) {
        try {
            const formData = new FormData();
            formData.append('model', transcription_model);
            formData.append('file', fs.createReadStream(filepath));

            const response = await axios.post(
                'https://api.openai.com/v1/audio/transcriptions',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${OPEN_AI_KEY}`,
                        ...formData.getHeaders(),
                    },
                }
            );
            return response.data.text;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function main() {
        const transcription = await transcribe(filepath);

        if (transcription) {
            const chatResponse = await openai.chat.completions.create({
                model: chatgpt_model,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    {
                        role: 'user',
                        content: `translate the following text to ${language}: ${transcription}`,
                    },
                ],
            });
            return [chatResponse.choices[0].message, transcription]
        }
    }

    return main();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.use(cors());

app.post('/upload', upload.single('audioFile'), async (req, res) => {
    const filePath = req.file.path;
    const language = req.body.language;
    const result = await transcribe_translate_file(filePath, language);

    res.json({ transcriptionAndTranslation: result });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
