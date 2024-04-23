const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
