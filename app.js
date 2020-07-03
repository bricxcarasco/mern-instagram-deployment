const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { MONGOURI } = require('./config/keys');

const app = express();
const PORT =  process.env.PORT || 5000;

mongoose.connect(MONGOURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
    console.log("error connection", err);
});

require('./models/user');
require('./models/post');

app.use(cors());
app.use(express.json());
app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == "production") {
    app.use(express.static('frontend/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
});