import express from "express";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
import errorHandleMiddleware from "./middleware/error.middleware.js";
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
app.use("/api/v1", orderRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);

// app.use(errorHandleMiddleware)
export default app;
