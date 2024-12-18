import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import express from 'express';
import PATH from './app.config'
import {
    categoryRouter,
    categoryAttributeRouter,
    imageRouter,
    productRouter,
    userRouter,
    cartRouter,
    orderRouter,
    addressRouter,
    sellerRouter,
    shipmentRouter,
    warehouseRouter,
    inventoryRouter,
    // userUpdateRouter,
} from './routes';
import { loadCategories, loadAddresses } from './seeds';
import shippingRouter from './ShippingProvider/shipping-routers';
// Uncomment these lines if you want to run the seed functions to initial Data
// loadCategories();
// loadAddresses();

const app = express();
const configureMiddleware = (app: express.Application) => {
    app.use(express.json({ limit: '50mb' }));
    app.use(cors({ 
        origin: 'http://localhost:5173', 
        credentials: true, 
        optionsSuccessStatus: 200 
    }));
    app.use(cookieParser());
};


const configureRoutes = (app: express.Application) => {
    app.use(PATH.IMAGE, imageRouter);
    app.use(PATH.CATEGORY_ATTRIBUTE, categoryAttributeRouter);
    app.use(PATH.CATEGORY, categoryRouter);
    app.use(PATH.PRODUCT, productRouter);
    app.use(PATH.USER, userRouter);
    app.use(PATH.CART, cartRouter);
    app.use(PATH.ORDER, orderRouter);
    app.use(PATH.ADDRESS, addressRouter);
    app.use(PATH.SELLER, sellerRouter);
    app.use(PATH.SHIPMENT, shipmentRouter);
    app.use(PATH.SHIPPING_PROVIDER, shippingRouter);
    app.use(PATH.WAREHOUSE, warehouseRouter);
    app.use(PATH.INVENTORY, inventoryRouter);
    // app.use(PATH.USERUPDATE, userUpdateRouter);
};

const initializeServer = () => {
    configureMiddleware(app);
    configureRoutes(app);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

initializeServer();
