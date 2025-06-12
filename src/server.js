import express from 'express';
import {config} from 'dotenv';
import { connectDB } from './db/index.js';
import { createSuperAdmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.routes.js';
config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT;

await connectDB();
await createSuperAdmin();

app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});