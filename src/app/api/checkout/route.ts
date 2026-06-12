import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

interface CheckoutItem {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  foto_url: string | null;
}

export async function POST(req: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json(
      { error: "Stripe nao configurado. Adicione STRIPE_SECRET_KEY nas variaveis de ambiente." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecret);

  try {
    const { items, frete } = (await req.json()) as { items: CheckoutItem[]; frete: number };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "brl",
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
          currency: "brl",
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
        item_ids: items.map((i) => i.id).join(","),
      },
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrinho`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao criar sessao de pagamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
