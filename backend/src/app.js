import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; //Cookie parser is used for parsing cookies in requests

const app = express();

app.use(cors({
    origin: 'https://my-project-dun-seven.vercel.app',
    credentials: true,
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

import userRoutes from './routes/user.routes.js';

app.use('/api/v1/users',userRoutes);

export default app;