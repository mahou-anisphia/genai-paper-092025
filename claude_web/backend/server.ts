import express from "express";
import cors from "cors";
import { connectDatabase, disconnectDatabase } from "./shared/database";
import { errorHandler } from "./shared/middleware";

import customerRouter from "./customer/CustomerRouter";
import productRouter from "./product/ProductRouter";
// Import other routers similarly

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRouter);
app.use("/api/products", productRouter);
// Add other routes

app.use(errorHandler);

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

startServer().catch(console.error);
