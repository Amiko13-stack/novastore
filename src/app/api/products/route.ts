import { requireAdmin } from "@/lib/auth/admin";
import type { NextRequest } from "next/server";
import { apiErrorResponse } from "@/lib/http/api-error";
import { catalogQuerySchema } from "@/lib/validation/catalog.schema";
import { createProductSchema } from "@/lib/validation/product.schema";
import { createProduct, searchProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const input = catalogQuerySchema.parse({
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      categoryId:
        request.nextUrl.searchParams.get("categoryId") ?? undefined,
      minPrice: request.nextUrl.searchParams.get("minPrice") ?? undefined,
      maxPrice: request.nextUrl.searchParams.get("maxPrice") ?? undefined,
      sort: request.nextUrl.searchParams.get("sort") ?? undefined,
    });

    const products = await searchProducts(input);

    return Response.json({
      success: true,
      data: products,
      meta: {
        count: products.length,
        filters: input,
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin(request);
    const body = await request.json();
    const input = createProductSchema.parse(body);
    const product = await createProduct(input);

    return Response.json(
      {
        success: true,
        data: product,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
