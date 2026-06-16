import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { requireAuth, isErrorResponse } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";

interface ReservaPayload {
  sala_id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
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
    const { sala_id, data, hora_inicio, hora_fim } = (await req.json()) as ReservaPayload;

    if (!sala_id || !data || !hora_inicio || !hora_fim) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: sala, error: salaErr } = await supabase
      .from("salas")
      .select("id, nome, preco_hora, status")
      .eq("id", sala_id)
      .single();

    if (salaErr || !sala) {
      return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
    }

    if (sala.status === "Manutenção") {
      return NextResponse.json({ error: "Sala em manutenção" }, { status: 400 });
    }

    const hInicio = parseInt(hora_inicio.split(":")[0]);
    const hFim = parseInt(hora_fim.split(":")[0]);
    const horas = hFim - hInicio;

    if (horas <= 0) {
      return NextResponse.json({ error: "Horário inválido" }, { status: 400 });
    }

    const valor = sala.preco_hora * horas;

    const { data: reserva, error: reservaErr } = await supabase
      .from("reservas")
      .insert({
        user_id: auth.user.id,
        sala_id: sala.id,
        data,
        hora_inicio,
        hora_fim,
        valor,
        status: "Pendente",
      })
      .select("id")
      .single();

    if (reservaErr) {
      return NextResponse.json({ error: "Erro ao criar reserva" }, { status: 500 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Aluguel — ${sala.nome}`,
              description: `${data} das ${hora_inicio} às ${hora_fim} (${horas}h)`,
            },
            unit_amount: Math.round(valor * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        tipo: "reserva",
        ref_id: reserva.id,
        sala_id: sala.id,
        sala_nome: sala.nome,
        data,
        hora_inicio,
        hora_fim,
      },
      customer_email: auth.user.email,
      success_url: `${origin}/painel/reservas?pagamento=sucesso&id=${reserva.id}`,
      cancel_url: `${origin}/painel/reservas?pagamento=cancelado&id=${reserva.id}`,
    });

    return NextResponse.json({
      url: session.url,
      reserva_id: reserva.id,
      valor,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
