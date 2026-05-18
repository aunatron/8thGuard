import { NextResponse } from "next/server";
import { getEnv } from "@/lib/config";
import { reviewStatusFromForm, updateReviewRequestStatus } from "@/lib/reviews";

function redirectToAdmin(req: Request, params: Record<string, string>): NextResponse {
  const url = new URL("/admin/reviews", req.url);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url, { status: 303 });
}

function compactFormText(value: FormDataEntryValue | null, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = compactFormText(formData.get("token"), 220);
  const requestId = compactFormText(formData.get("request_id"), 120);
  const status = reviewStatusFromForm(formData.get("status"));
  const { adminReviewToken } = getEnv();

  if (!adminReviewToken || token !== adminReviewToken) {
    return redirectToAdmin(req, { status: "locked" });
  }

  if (!requestId || !status) {
    return redirectToAdmin(req, { token, status: "error", reason: "invalid_status_update" });
  }

  const result = await updateReviewRequestStatus({
    requestId,
    status,
    actorId: "admin_review_desk"
  });

  if (!result.configured) {
    return redirectToAdmin(req, { token, status: "error", reason: "supabase_not_configured" });
  }

  return redirectToAdmin(req, {
    token,
    status: result.updated ? "updated" : "error",
    reason: result.updated ? "" : "request_not_found",
    request_id: requestId
  });
}
