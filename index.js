const express = require('express');
var cors = require('cors');
const path = require('path');
const dotnev = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const fileupload = require('express-fileupload');
const connectDb = require('./config/db');

dotnev.config({ path: './config.env' });

connectDb();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoute');


const app = express();
app.use(cors());


app.use(express.json());

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.PORT} mode port ${process.env.PORT}`.blue)
);


process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`);
    server.close(() => process.exit(1));
});