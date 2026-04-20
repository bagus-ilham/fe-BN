import { NextResponse } from "next/server";

/**
 * MOCK Shipping Quote API — benangbaju (Mockup Mode)
 * Returns simulated Indonesian shipping rates (JNE, J&T, SiCepat).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[MOCK SHIPPING] Calculation for:", body.postalCode);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const subtotal = body.cartItems?.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0) || 0;
    const isFreeShipping = subtotal >= 250000;

    const options = [
      {
        id: "jne_reg",
        name: "JNE Reguler",
        price: isFreeShipping ? 0 : 15000,
        deliveryTime: 2,
        deliveryRange: { min: 2, max: 3 },
        company: { id: 1, name: "JNE" },
        type: "standard"
      },
      {
        id: "jnt_ez",
        name: "J&T EZ",
        price: isFreeShipping ? 0 : 12000,
        deliveryTime: 2,
        deliveryRange: { min: 2, max: 4 },
        company: { id: 2, name: "J&T" },
        type: "standard"
      },
      {
        id: "sicepat_reg",
        name: "SiCepat Reguler",
        price: isFreeShipping ? 0 : 10000,
        deliveryTime: 2,
        deliveryRange: { min: 1, max: 3 },
        company: { id: 3, name: "SiCepat" },
        type: "standard"
      }
    ];

    return NextResponse.json({
      quotes: options,
      freeShippingThreshold: 250000,
      isFreeShipping,
      subtotal
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", quotes: null },
      { status: 500 }
    );
  }
}
