const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Use environment variable for access token (safer for deployment)
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'YOUR_FACEBOOK_USER_ACCESS_TOKEN';

app.post('/api/post-to-facebook', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const fbRes = await axios.post(
      'https://graph.facebook.com/v13.0/me/feed',
      null,
      {
        params: {
          message,
          access_token: ACCESS_TOKEN,
        },
      }
    );
    res.json({ success: true, data: fbRes.data });
  } catch (error) {
    console.error('Facebook API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to post to Facebook', details: error.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
