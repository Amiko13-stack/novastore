import { getCurrentUserId } from "@/lib/auth/current-user";
import { apiErrorResponse } from "@/lib/http/api-error";
import { addWishlistItemSchema } from "@/lib/validation/wishlist.schema";
import { addToWishlist, getWishlist } from "@/services/wishlist.service";

export async function GET() {
  try {
    const userId = getCurrentUserId();
    const wishlist = await getWishlist(userId);

    return Response.json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();
    const input = addWishlistItemSchema.parse(body);
    const item = await addToWishlist(userId, input);

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
