import express from 'express';

process.loadEnvFile();

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({message: "Welcome to the API"});
});

app.listen(port, () => {
    console.log(`My app listening on port ${port}`);
});