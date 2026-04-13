require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Initialize App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet());

app.use(cors({ origin: 'http://localhost:5173' }));


app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/leads', require('./src/routes/leadRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mini CRM API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`--- Server is starting... ---`);
    console.log(`Port: ${PORT}`);
});

module.exports = app;
