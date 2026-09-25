import { requireAdmin } from "@/lib/auth/admin";
import { apiErrorResponse } from "@/lib/http/api-error";
import { getAdminData } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    requireAdmin(request);
    const data = await getAdminData();
    return Response.json({ success: true, database: "connected", counts: Object.fromEntries(Object.entries(data).map(([name, rows]) => [name, rows.length])) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
