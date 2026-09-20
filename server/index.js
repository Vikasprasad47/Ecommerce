import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import connectDB from './config/connectDB.js';
import { runtimeStats } from './utils/runtimeStats.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { validateRequiredEnv } from './utils/validateEnv.js';

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
import couponRouter from './route/coupon.route.js';
import subscribeNewsletterRouter from './route/newsletter.routes.js';
import Contactrouter from './route/contact.routes.js';
import sellerRouter from './route/seller.routes.js';

validateRequiredEnv();

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.FRONTED_URL,
}));

app.use((req, res, next) => {
  runtimeStats.totalRequests++;
  runtimeStats.lastRequestAt = new Date();
  next();
});

app.use('/api/order/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('common'));
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

const PORT = Number(process.env.PORT || 8080);

app.use('/', dashboardRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/upload-file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', OrderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/newsletter', subscribeNewsletterRouter);
app.use('/api/contact', Contactrouter);
app.use('/api/seller', sellerRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '404 - Page Not Found Or Api Does Not Exist',
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: '500 - Internal Server Error',
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running: http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
