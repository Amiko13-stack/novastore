import { getCurrentUserId } from "@/lib/auth/current-user";
import { apiErrorResponse } from "@/lib/http/api-error";
import { addCartItemSchema } from "@/lib/validation/cart.schema";
import { addToCart, getCart } from "@/services/cart.service";

export async function GET() {
  try {
    const userId = getCurrentUserId();
    const cart = await getCart(userId);

    return Response.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();
    const input = addCartItemSchema.parse(body);
    const item = await addToCart(userId, input);

    return Response.json(
      {
        success: true,
        data: item,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
