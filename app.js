require('colors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { userRouter } = require('./routes');
require('dotenv').config();

const { DB_HOST, PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  const { status = 500, message = 'Server error!' } = error;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log('[Server] Database connection successful!'.magenta);
    app.listen(PORT, () => {
      console.log(`[Server] Server started on port ${PORT}!`.magenta);
    });
  })
  .catch(() => {
    console.log(
      '[Server] Connection to DB is failed! Server is not started!'.red
    );
    process.exit(1);
  });
