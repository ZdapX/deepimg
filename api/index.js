
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const Agung = {
    config: {
        apiUrl: 'https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev',
        imageSize: '1024x1024',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://deepimg.ai',
            'Referer': 'https://deepimg.ai/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
        }
    },

    _getDeviceId: () => `dev-${Math.floor(Math.random() * 1000000)}`,

    generate: async (prompt) => {
        try {
            if (!prompt) return { status: 400, success: false, message: "Promptna mana, mang?" };

            const response = await axios.post(Agung.config.apiUrl, {
                prompt: prompt,
                size: Agung.config.imageSize,
                device_id: Agung._getDeviceId()
            }, { 
                headers: Agung.config.headers 
            });

            const imageUrl = response.data?.data?.images?.[0]?.url;

            if (!imageUrl) throw new Error("Gagal mendapatkan URL gambar.");

            return {
                status: 200,
                success: true,
                owners: "AgungDevX",
                url: imageUrl
            };
        } catch (err) {
            return {
                status: 500,
                success: false,
                message: err.response?.data?.message || err.message
            };
        }
    }
};

app.get('/api/generate', async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) return res.status(400).json({ success: false, message: "Isi promptnya!" });
    
    const result = await Agung.generate(prompt);
    res.status(result.status).json(result);
});

module.exports = app;
