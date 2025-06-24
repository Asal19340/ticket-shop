import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import { createSuperAdmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import customerRouter from './routes/customer.routes.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());

await connectDB();
await createSuperAdmin();

app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/transport', transportRouter);
app.use('/ticket', ticketRouter);
app.use('/customer', customerRouter);


app.use((err, _, res, _) => {
    if (err) {
        const statusCode = err.status ? err.status : 500;
        const message = err.message ? err.message : 'Internal server error';
        return res.status(statusCode).json({
            statusCode,
            message
        });
    }
});

app.listen(config.PORT, () => console.log('server running on port', +config.PORT));