import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { requireAuth, isErrorResponse } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

interface ItemPayload {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  foto_url: string | null;
}

interface CheckoutPayload {
  items: ItemPayload[];
  frete: number;
}

export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe não configurado. Adicione STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const auth = await requireAuth();
  if (isErrorResponse(auth)) return auth;

  try {
    const { items, frete } = (await req.json()) as CheckoutPayload;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.preco * i.qty, 0);
    const total = subtotal + (frete || 0);

    const supabase = await createClient();

    const { data: pedido, error: pedidoErr } = await supabase
      .from("pedidos")
      .insert({
        user_id: auth.user.id,
        itens: items.map((i) => ({ nome: i.nome, qty: i.qty, preco: i.preco })),
        subtotal,
        frete: frete || 0,
        total,
        status: "Pendente",
      })
      .select("id")
      .single();

    if (pedidoErr) {
      console.error("Supabase pedido insert error:", pedidoErr);
      return NextResponse.json({ error: `Erro ao criar pedido: ${pedidoErr.message}` }, { status: 500 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const stripe = getStripe();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "brl" as const,
        product_data: {
          name: item.nome,
          ...(item.foto_url ? { images: [item.foto_url] } : {}),
        },
        unit_amount: Math.round(item.preco * 100),
      },
      quantity: item.qty,
    }));

    if (frete > 0) {
      line_items.push({
        price_data: {
          currency: "brl" as const,
          product_data: { name: "Frete" },
          unit_amount: Math.round(frete * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      metadata: {
        tipo: "pedido",
        ref_id: pedido.id,
        item_ids: items.map((i) => i.id).join(","),
        total_items: String(items.length),
      },
      customer_email: auth.user.email,
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}&pedido=${pedido.id}`,
      cancel_url: `${origin}/carrinho`,
    });

    return NextResponse.json({
      url: session.url,
      pedido_id: pedido.id,
      total,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
