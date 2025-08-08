const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const userRoutes = require('./routes/auth.rout.js');
const productRoutes = require('./routes/product.rout.js');  

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRoutes);
app.use('/api/product', productRoutes);  

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
});
