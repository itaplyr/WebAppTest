require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// In-memory log storage
const logs = {
    incoming: [],
    outgoing: []
};

// Middleware to log incoming requests
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };

        // Don't log internal dashboard API calls to avoid clutter
        if (!req.path.startsWith('/api/logs')) {
            logs.incoming.unshift(logEntry);
            if (logs.incoming.length > 500) logs.incoming.pop();
        }
    });
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// API Routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'password123';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.user = { username: ADMIN_USER };
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out' });
});

// Logs API
app.get('/api/logs/incoming', isAuthenticated, (req, res) => {
    res.json(logs.incoming);
});

app.get('/api/logs/stats', isAuthenticated, (req, res) => {
    const stats = {
        totalRequests: logs.incoming.length,
        successCount: logs.incoming.filter(l => l.status < 400).length,
        errorCount: logs.incoming.filter(l => l.status >= 400).length,
        avgDuration: logs.incoming.length > 0
            ? (logs.incoming.reduce((acc, l) => acc + parseInt(l.duration), 0) / logs.incoming.length).toFixed(2) + 'ms'
            : '0ms'
    };
    res.json(stats);
});

app.listen(port, () => {
    console.log(`Admin System running at http://localhost:${port}`);
});
