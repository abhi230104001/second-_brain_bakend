const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5000'], // Add your deployed frontend URL here
    credentials: true
}));
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/folders', require('./routes/folderRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler
app.use(errorHandler);

module.exports = app;
