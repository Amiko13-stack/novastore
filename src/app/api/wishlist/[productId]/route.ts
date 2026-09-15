import { getCurrentUserId } from "@/lib/auth/current-user";
import { apiErrorResponse } from "@/lib/http/api-error";
import { removeFromWishlist } from "@/services/wishlist.service";

type WishlistItemRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function DELETE(
  _request: Request,
  { params }: WishlistItemRouteContext,
) {
  try {
    const userId = getCurrentUserId();
    const { productId } = await params;
    await removeFromWishlist(userId, productId);

    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
