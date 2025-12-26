const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (we'll put our frontend here later)
app.use(express.static('public'));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
