import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';

// routes
import userRouter from './route/user.route.js'; 
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/uploadimage.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import OrderRouter from './route/order.route.js';
import reviewRouter from './route/review.route.js';
import analyticsRouter from './route/analytics.route.js';
import couponRouter from './route/coupon.route.js'

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.FRONTED_URL,
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('common'));
app.use(helmet({
    crossOriginEmbedderPolicy: false
}));

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({
        message: 'The server is running on port ' + PORT
    });
});

// all routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/upload-file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', OrderRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/analytics', analyticsRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "404 - Page Not Found Or Api Does Not Exist"
    });
});

// 500 error handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "500 - Internal Server Error"
    });
});
 
// connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running: http://localhost:${PORT}`);
    });
});

export default app;
