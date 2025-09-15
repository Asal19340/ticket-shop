import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import { createSuperAdmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/admin', adminRouter);

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({ statusCode, message });
});

const start = async () => {
    try {
        await connectDB();
        await createSuperAdmin();
        app.listen(config.PORT, () => {
            console.log('Server running on port', config.PORT);
        });
    } catch (error) {
        console.error('Server start error:', error);
    }
};

start();
