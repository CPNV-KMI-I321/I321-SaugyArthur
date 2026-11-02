import express from 'express';
import usersRouter from './routes/users.js';
import 'dotenv/config'
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

app.get('/', (req, res) => {
    res.json({message: "Welcome to the API"});
});

app.use('/api/users', usersRouter)

app.listen(port, () => {
    console.log(`My app listening on port ${port}`);
});