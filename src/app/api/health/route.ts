export async function GET() {
  return Response.json({
    success: true,
    service: "NovaStore API",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
