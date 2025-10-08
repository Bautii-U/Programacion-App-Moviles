import { BASE_URL } from "../config/ip_config";

export type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error(`GET /productos ${res.status}`);
  return res.json();
}

export async function createProduct(body: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST /productos ${res.status}`);
  return res.json();
}