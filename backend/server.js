const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.set('strictQuery', false);  // 或 true，取决于您的偏好
mongoose.connect('mongodb://localhost:27017/rotapuzzle', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Add routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
