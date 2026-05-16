import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getPolarProductId, getPolarServerConfig } from "@/lib/payments/config";
import { isProductId } from "@/lib/payments/session";

function polarCheckoutHandler() {
  const config = getPolarServerConfig();
  return Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: config.successUrl,
    returnUrl: config.returnUrl,
    server: config.server,
    theme: "dark",
    includeCheckoutId: true
  });
}

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId") || "";
  const products = req.nextUrl.searchParams.get("products") || "";

  if (!isProductId(productId)) {
    return NextResponse.json({ ok: false, error: "invalid_product" }, { status: 400 });
  }

  const expectedPolarProductId = getPolarProductId(productId);
  if (!expectedPolarProductId || products !== expectedPolarProductId) {
    return NextResponse.json({ ok: false, error: "polar_product_not_configured" }, { status: 400 });
  }

  return polarCheckoutHandler()(req);
}
