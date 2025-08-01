const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');
const userRouter = require('./routers/userRouter');

const app = express();
const port = 3000;

/* Middlewares */
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Project2 app is running at: http://localhost:${port}`);
  connectDB();
});