import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import mathRoutes from './routes/math.routes.js';
import cors from 'cors';

const app = express();
const API_VERSION = '/api/v1';

// CORS configurado correctamente para cookies

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,

}));


app.use(express.json());
app.use(cookieParser());

// Rutas
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/math`, mathRoutes);

export default app;
