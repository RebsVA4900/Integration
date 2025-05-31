const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Use environment variables for sensitive data
const MEMBERVAULT_API_KEY = process.env.b4ecf4860b28843bd17f5d00dfc210a6;
const MEMBERVAULT_ACCOUNT = process.env.taragrahamphotography;

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Webhook server running!');
});

// Webhook endpoint for Sails Funnel
app.post('/webhook', async (req, res) => {
    const { email, first_name, last_name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email in request' });
    }

    try {
        // Send to MemberVault
        const mvResponse = await axios.post(
            `https://${MEMBERVAULT_ACCOUNT}.membervault.co/api/v1/user`,
            {
                email,
                first_name,
                last_name
            },
            {
                headers: {
                    'Authorization': `Bearer ${MEMBERVAULT_API_KEY}`
                }
            }
        );
        res.status(200).json({ status: 'success', mv: mvResponse.data });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
