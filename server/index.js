const express = require('express');
const app = express();
const connectDB = require('./config/dbConnect');
var cors = require('cors');
const bodyParser = require('body-parser')

require('dotenv').config({ path: './config/config.env' });

connectDB();

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', require('./routes/auth'))

app.listen(process.env.PORT, () => {
    console.log("Server Running on ", process.env.PORT);
})