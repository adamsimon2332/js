import express from 'express';
import cors from 'cors';
import postsRoutes from './routes/postsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});