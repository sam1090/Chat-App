const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');

const app = express();

dbConnect();

app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);

const port = 5000 || process.env.PORT;

app.get('/', (req, res) => {
  res.send('hello from the server side ');
});
app.listen(port, (req, res) => {
  console.log(`Server running on port :${port} `);
});
