const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');

const productRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const app = express();
const port = 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db Connected'))
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/products', productRouter);
app.use('/api/', authRouter);

// Error handing
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT || port, () =>
  console.log(`App listening on port ${process.env.PORT}!`)
);
