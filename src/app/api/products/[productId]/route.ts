import { apiErrorResponse } from "@/lib/http/api-error";
import { updateProductSchema } from "@/lib/validation/product.schema";
import {
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/services/product.service";

type ProductRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(
  _request: Request,
  { params }: ProductRouteContext,
) {
  try {
    const { productId } = await params;
    const product = await getProduct(productId);

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: ProductRouteContext,
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const input = updateProductSchema.parse(body);
    const product = await updateProduct(productId, input);

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: ProductRouteContext,
) {
  try {
    const { productId } = await params;
    const product = await deleteProduct(productId);

    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
