import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCustomers() {
  return await prisma.customer.findMany();
}

export async function getCustomer(id: number) {
  return await prisma.customer.findUnique({
    where: { id },
  });
}

export async function createCustomer(data: any) {
  return await prisma.customer.create({
    data,
  });
}

export async function updateCustomer(id: number, data: any) {
  return await prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: number) {
  return await prisma.customer.delete({
    where: { id },
  });
}