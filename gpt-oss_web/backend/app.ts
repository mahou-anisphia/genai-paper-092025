import express from "express";
import cors from "cors";
import { json, urlencoded } from "express";
import { PrismaClient } from "@prisma/client";
import customerRouter from "./customer/router";
import productRouter from "./product/router";
import orderRouter from "./order/router";
import paymentRouter from "./payment/router";
import invoiceRouter from "./invoice/router";

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));