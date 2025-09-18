import express, { Request, Response } from "express";
import customerRouter from "./customer/router";
import invoiceRouter from "./invoice/router";
import orderRouter from "./order/router";
import paymentRouter from "./payment/router";
import productRouter from "./product/router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/customers", customerRouter);
app.use("/invoices", invoiceRouter);
app.use("/orders", orderRouter);
app.use("/payments", paymentRouter);
app.use("/products", productRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});