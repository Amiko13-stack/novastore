import { getCurrentUserId } from "@/lib/auth/current-user";
import { apiErrorResponse } from "@/lib/http/api-error";
import { updateCartItemSchema } from "@/lib/validation/cart.schema";
import { removeFromCart, setCartQuantity } from "@/services/cart.service";

type CartItemRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(
  request: Request,
  { params }: CartItemRouteContext,
) {
  try {
    const userId = getCurrentUserId();
    const { productId } = await params;
    const body = await request.json();
    const input = updateCartItemSchema.parse(body);
    const item = await setCartQuantity(userId, productId, input);

    return Response.json({
      success: true,
      data: item,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: CartItemRouteContext,
) {
  try {
    const userId = getCurrentUserId();
    const { productId } = await params;
    await removeFromCart(userId, productId);

    return Response.json({
      success: true,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
