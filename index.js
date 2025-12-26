const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (we'll put our frontend here later)
app.use(express.static('public'));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Express Server</title>
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: radial-gradient(circle at top right, #1a1a2e, #16213e);
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0;
                overflow: hidden;
            }
            .container {
                text-align: center;
                padding: 3rem;
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border-radius: 24px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                animation: fadeIn 1s ease-out;
            }
            h1 {
                font-size: 3.5rem;
                margin-bottom: 1rem;
                background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                color: #94a3b8;
                font-size: 1.2rem;
            }
            .status {
                display: inline-block;
                margin-top: 2rem;
                padding: 0.5rem 1.5rem;
                background: rgba(34, 197, 94, 0.2);
                color: #4ade80;
                border-radius: 9999px;
                font-weight: 600;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Express is Live</h1>
            <p>Your server is running successfully on Pella.</p>
            <div class="status">● Server Online</div>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
