import { NextRequest, NextResponse } from "next/server";

const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;
const MELHOR_ENVIO_URL = "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";

const ORIGIN_CEP = "59020-100"; // CEP da clinica/deposito

interface Item {
  qty: number;
  preco: number;
}

export async function POST(req: NextRequest) {
  try {
    const { cep, items } = (await req.json()) as { cep: string; items: Item[] };

    if (!cep || cep.length !== 8) {
      return NextResponse.json({ error: "CEP invalido" }, { status: 400 });
    }

    const totalQty = items.reduce((s: number, i: Item) => s + i.qty, 0);
    const totalValue = items.reduce((s: number, i: Item) => s + i.preco * i.qty, 0);

    if (totalValue >= 299) {
      return NextResponse.json({
        nome: "Frete Gratis",
        preco: 0,
        prazo: 7,
      });
    }

    if (!MELHOR_ENVIO_TOKEN) {
      const simulatedPrice = 15 + totalQty * 3.5;
      return NextResponse.json({
        nome: "PAC - Correios (simulado)",
        preco: Math.round(simulatedPrice * 100) / 100,
        prazo: 8,
      });
    }

    const body = {
      from: { postal_code: ORIGIN_CEP.replace("-", "") },
      to: { postal_code: cep },
      products: [
        {
          id: "1",
          width: 20,
          height: 10 * totalQty,
          length: 30,
          weight: 0.5 * totalQty,
          insurance_value: totalValue,
          quantity: 1,
        },
      ],
    };

    const res = await fetch(MELHOR_ENVIO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MELHOR_ENVIO_TOKEN}`,
        Accept: "application/json",
        "User-Agent": "ClinicHub (fjntecnologia2022@gmail.com)",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Nenhuma opcao de frete disponivel" }, { status: 400 });
    }

    const cheapest = data
      .filter((d: { error?: string }) => !d.error)
      .sort((a: { price: string }, b: { price: string }) => parseFloat(a.price) - parseFloat(b.price))[0];

    if (!cheapest) {
      return NextResponse.json({ error: "Frete indisponivel para este CEP" }, { status: 400 });
    }

    return NextResponse.json({
      nome: `${cheapest.name} - ${cheapest.company?.name ?? ""}`.trim(),
      preco: parseFloat(cheapest.price),
      prazo: cheapest.delivery_time ?? 10,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 });
  }
}
