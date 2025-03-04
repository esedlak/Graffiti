const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/posts.routes');
const subscriptionRoute = require('./routes/subscription.routes');

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connection = undefined;

const app = express();
//const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use('/posts', postsRoutes);
app.use('/subscription', subscriptionRoute);

app.listen(process.env.PORT, (error) => {
    if(error) {
        console.log('error', error)
    } else {
        console.log(`server running on http://localhost:${process.env.PORT}`)
    }
})

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME });
const db = mongoose.connection;
db.on('error', err => {
    console.log(err);
  });
  db.once('open', () => {
      console.log('connected to DB');
  });