import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', authRoutes); // /login, /register
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'EventFlow API is running with latest updates' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
