import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao verificar webhook";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(intent);
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(intent);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }
    }
  } catch (err) {
    console.error(`Erro ao processar evento ${event.type}:`, err);
    return NextResponse.json({ error: "Erro interno ao processar evento" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tipo = session.metadata?.tipo;
  const id = session.metadata?.ref_id;

  if (tipo === "reserva" && id) {
    await supabaseAdmin
      .from("reservas")
      .update({
        status: "Confirmada",
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
      })
      .eq("id", id);
  }

  if (tipo === "pedido" && id) {
    await supabaseAdmin
      .from("pedidos")
      .update({
        status: "Pago",
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        metodo_pagamento: "Cartão de Crédito",
      })
      .eq("id", id);
  }

  await supabaseAdmin.from("pagamentos").insert({
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent as string,
    tipo: tipo || "desconhecido",
    ref_id: id || null,
    valor: (session.amount_total || 0) / 100,
    moeda: session.currency || "brl",
    status: "pago",
    email_cliente: session.customer_details?.email || null,
    nome_cliente: session.customer_details?.name || null,
    metadata: session.metadata || {},
  });
}

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  await supabaseAdmin
    .from("pagamentos")
    .update({ status: "pago" })
    .eq("stripe_payment_intent", intent.id);
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  await supabaseAdmin
    .from("pagamentos")
    .update({
      status: "falhou",
      erro: intent.last_payment_error?.message || "Pagamento recusado",
    })
    .eq("stripe_payment_intent", intent.id);

  const ref = intent.metadata?.ref_id;
  const tipo = intent.metadata?.tipo;

  if (tipo === "reserva" && ref) {
    await supabaseAdmin.from("reservas").update({ status: "Pendente" }).eq("id", ref);
  }
  if (tipo === "pedido" && ref) {
    await supabaseAdmin.from("pedidos").update({ status: "Pendente" }).eq("id", ref);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const pi = charge.payment_intent as string;
  if (pi) {
    await supabaseAdmin
      .from("pagamentos")
      .update({
        status: "reembolsado",
        reembolso_valor: (charge.amount_refunded || 0) / 100,
      })
      .eq("stripe_payment_intent", pi);
  }
}
