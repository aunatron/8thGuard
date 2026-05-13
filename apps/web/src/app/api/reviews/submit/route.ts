import { NextResponse } from "next/server";
import { createReviewRequest, reviewSubmissionFromForm } from "@/lib/reviews";

function redirectToSubmit(req: Request, params: Record<string, string>): NextResponse {
  const url = new URL("/submit", req.url);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const parsed = reviewSubmissionFromForm(formData);

  if (!parsed.ok) {
    return redirectToSubmit(req, { status: "error", reason: parsed.error });
  }

  const result = await createReviewRequest(parsed.input);
  return redirectToSubmit(req, {
    status: "received",
    request_id: result.request.id,
    session_id: result.request.sessionId
  });
}
