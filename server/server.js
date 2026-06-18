const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

connectDB();

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://16.170.229.152:5000'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/temples', require('./routes/temples'));
app.use('/api/circuits', require('./routes/circuits'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => {
    res.send('India Temple Portal API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});