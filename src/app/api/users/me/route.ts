import { getCurrentUserId } from "@/lib/auth/current-user";
import { apiErrorResponse } from "@/lib/http/api-error";
import { updateUserSchema } from "@/lib/validation/user.schema";
import { getOrCreateUser, updateUserProfile } from "@/services/user.service";

export async function GET() {
  try {
    const user = await getOrCreateUser(getCurrentUserId());
    return Response.json({ success: true, data: user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const input = updateUserSchema.parse(body);
    const user = await updateUserProfile(getCurrentUserId(), input);

    return Response.json({ success: true, data: user });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
