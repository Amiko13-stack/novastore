import { requireAdmin } from "@/lib/auth/admin";
import { apiErrorResponse } from "@/lib/http/api-error";
import { manageRecord } from "@/services/admin.service";
export async function POST(request: Request) {
  try {
    requireAdmin(request);
    const data = await manageRecord(await request.json());
    return Response.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiErrorResponse(error); }
}
