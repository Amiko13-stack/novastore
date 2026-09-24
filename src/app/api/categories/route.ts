import { requireAdmin } from "@/lib/auth/admin";
import { apiErrorResponse } from "@/lib/http/api-error";
import { createCategorySchema } from "@/lib/validation/category.schema";
import {
  createCategory,
  getCategories,
} from "@/services/category.service";

export async function GET() {
  try {
    const categories = await getCategories();

    return Response.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    requireAdmin(request);
    const body = await request.json();
    const input = createCategorySchema.parse(body);
    const category = await createCategory(input);

    return Response.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
