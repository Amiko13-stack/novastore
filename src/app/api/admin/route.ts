import { requireAdmin } from "@/lib/auth/admin";
import { apiErrorResponse } from "@/lib/http/api-error";
import { getAdminData } from "@/services/admin.service";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    requireAdmin(request);
    return Response.json(await getAdminData(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const response = apiErrorResponse(error);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
