import { prisma } from "@/lib/prisma";
import ProductManager, {
  type ProductRecord,
} from "./product-manager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const initialProducts: ProductRecord[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    sku: product.sku,
    active: product.active,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  return <ProductManager initialProducts={initialProducts} />;
}