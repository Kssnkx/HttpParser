const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Добавлено для поддержки CORS
const { WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

const keywords = {
    'example': ['https://example.com', 'https://anotherexample.com'],
    'test': ['https://test.com', 'https://anothertest.com'],
    'youtube': ['https://www.youtube.com', 'https://www.youtube.com'],
};

app.use(cors()); // Используем cors middleware
app.use(express.json());

app.get('/keywords/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    if (keywords[keyword]) {
        res.json(keywords[keyword]);
    } else {
        res.status(404).json({ error: 'Keyword not found' });
    }
});

app.post('/download', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url);
        res.json({ content: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to download content' });
    }
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const { url } = JSON.parse(message);

        try {
            const response = await axios.get(url, {
                responseType: 'stream'
            });

            let data = '';
            let totalLength = parseInt(response.headers['content-length'], 10);
            let receivedLength = 0;

            response.data.on('data', (chunk) => {
                receivedLength += chunk.length;
                ws.send(JSON.stringify({
                    progress: Math.round((receivedLength / totalLength) * 100)
                }));
                data += chunk;
            });

            response.data.on('end', () => {
                ws.send(JSON.stringify({
                    content: data
                }));
                ws.close();
            });
        } catch (error) {
            ws.send(JSON.stringify({ error: 'Failed to download content' }));
            ws.close();
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
