import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

dotenv.config({ path: ".env.local" });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env.local`);
  return value;
}

const client = new DynamoDBClient({
  region: required("AWS_REGION"),
});

const documentClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

const categoriesTable = required("DYNAMODB_CATEGORIES_TABLE");
const productsTable = required("DYNAMODB_PRODUCTS_TABLE");

const categories = [
  {
    categoryId: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Modern technology and everyday devices.",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-12T08:00:00.000Z",
  },
  {
    categoryId: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Modern clothing and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-12T08:01:00.000Z",
  },
  {
    categoryId: "cat-home",
    name: "Home & Living",
    slug: "home-living",
    description: "Useful and stylish products for your home.",
    imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-12T08:02:00.000Z",
  },
];

const products = [
  {
    productId: "prod-headphones",
    categoryId: "cat-electronics",
    name: "Nova Wireless Headphones",
    slug: "nova-wireless-headphones",
    description: "Comfortable over-ear wireless headphones with clear sound and long battery life.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    stock: 24,
    featured: true,
    createdAt: "2026-09-12T09:00:00.000Z",
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    productId: "prod-watch",
    categoryId: "cat-electronics",
    name: "Pulse Smart Watch",
    slug: "pulse-smart-watch",
    description: "A lightweight smart watch for notifications, workouts, activity tracking and daily use.",
    price: 179.99,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    stock: 18,
    featured: true,
    createdAt: "2026-09-12T09:01:00.000Z",
    updatedAt: "2026-09-12T09:01:00.000Z",
  },
  {
    productId: "prod-sneakers",
    categoryId: "cat-fashion",
    name: "Street Runner Sneakers",
    slug: "street-runner-sneakers",
    description: "Everyday sneakers designed for a clean streetwear look and comfortable walking.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    stock: 32,
    featured: true,
    createdAt: "2026-09-12T09:02:00.000Z",
    updatedAt: "2026-09-12T09:02:00.000Z",
  },
  {
    productId: "prod-jacket",
    categoryId: "cat-fashion",
    name: "Essential Street Jacket",
    slug: "essential-street-jacket",
    description: "A versatile lightweight jacket made for layering and casual everyday outfits.",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    stock: 15,
    featured: false,
    createdAt: "2026-09-12T09:03:00.000Z",
    updatedAt: "2026-09-12T09:03:00.000Z",
  },
  {
    productId: "prod-lamp",
    categoryId: "cat-home",
    name: "Minimal Desk Lamp",
    slug: "minimal-desk-lamp",
    description: "A compact modern desk lamp that adds warm functional lighting to a workspace.",
    price: 54.99,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    stock: 27,
    featured: false,
    createdAt: "2026-09-12T09:04:00.000Z",
    updatedAt: "2026-09-12T09:04:00.000Z",
  },
  {
    productId: "prod-chair",
    categoryId: "cat-home",
    name: "Nordic Lounge Chair",
    slug: "nordic-lounge-chair",
    description: "A simple lounge chair with a clean silhouette for bedrooms, offices and living rooms.",
    price: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
    stock: 9,
    featured: true,
    createdAt: "2026-09-12T09:05:00.000Z",
    updatedAt: "2026-09-12T09:05:00.000Z",
  },
];

for (const category of categories) {
  await documentClient.send(
    new PutCommand({
      TableName: categoriesTable,
      Item: category,
    }),
  );
  console.log(`✓ category: ${category.name}`);
}

for (const product of products) {
  await documentClient.send(
    new PutCommand({
      TableName: productsTable,
      Item: product,
    }),
  );
  console.log(`✓ product: ${product.name}`);
}

console.log("\nDatabase seed complete.");
