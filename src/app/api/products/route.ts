import type { NextRequest } from "next/server";
import { apiErrorResponse } from "@/lib/http/api-error";
import { createProductSchema } from "@/lib/validation/product.schema";
import { createProduct, getProducts } from "@/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get("categoryId") ?? undefined;
    const products = await getProducts(categoryId);

    return Response.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
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
