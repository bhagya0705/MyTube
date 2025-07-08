import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; //Cookie parser is used for parsing cookies in requests

const app = express();

app.use(cors({
    origin: 'https://mytube-cu8h47nj3-bhagyas-projects-bd2a4e8e.vercel.app',
    credentials: true,
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import userRoutes from './routes/user.routes.js';

app.use('/api/v1/users',userRoutes);

export default app;