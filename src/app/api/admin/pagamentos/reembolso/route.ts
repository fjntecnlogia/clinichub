import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/api-auth";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isErrorResponse(auth)) return auth;

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe não configurado" },
      { status: 503 }
    );
  }

  try {
    const { payment_intent_id, valor, motivo } = (await req.json()) as {
      payment_intent_id: string;
      valor?: number;
      motivo?: string;
    };

    if (!payment_intent_id) {
      return NextResponse.json({ error: "payment_intent_id é obrigatório" }, { status: 400 });
    }

    const stripe = getStripe();

    const refundParams: Record<string, unknown> = {
      payment_intent: payment_intent_id,
    };
    if (valor) {
      refundParams.amount = Math.round(valor * 100);
    }
    if (motivo) {
      refundParams.reason = "requested_by_customer";
    }

    const refund = await stripe.refunds.create(refundParams as Parameters<typeof stripe.refunds.create>[0]);

    const supabase = await createClient();
    await supabase
      .from("pagamentos")
      .update({
        status: valor ? "reembolso_parcial" : "reembolsado",
        reembolso_valor: (refund.amount || 0) / 100,
        reembolso_motivo: motivo || null,
        reembolso_id: refund.id,
        reembolso_por: auth.user.id,
      })
      .eq("stripe_payment_intent", payment_intent_id);

    return NextResponse.json({
      sucesso: true,
      reembolso: {
        id: refund.id,
        valor: (refund.amount || 0) / 100,
        status: refund.status,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao processar reembolso";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
