import { Router } from "express";
import { CustomerController } from "./CustomerController";
import { validateRequest } from "../shared/middleware";
import { CustomerDomain } from "../../modules/customer/Customer";

const router = Router();
const customerController = new CustomerController();

router.post(
  "/",
  validateRequest(CustomerDomain.validateCustomer),
  customerController.createCustomer
);

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

router.put(
  "/:id",
  validateRequest(CustomerDomain.validateCustomer),
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

export default router;