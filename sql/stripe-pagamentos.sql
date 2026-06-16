-- ============================================================
-- MaciHub — Tabela de Pagamentos + Colunas Stripe
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Tabela de pagamentos (registro central de todas transações Stripe)
CREATE TABLE IF NOT EXISTS pagamentos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id text,
  stripe_payment_intent text,
  tipo text NOT NULL CHECK (tipo IN ('reserva', 'pedido', 'desconhecido')),
  ref_id uuid,
  valor numeric(10,2) NOT NULL DEFAULT 0,
  moeda text NOT NULL DEFAULT 'brl',
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'falhou', 'reembolsado', 'reembolso_parcial')),
  email_cliente text,
  nome_cliente text,
  metadata jsonb DEFAULT '{}',
  erro text,
  reembolso_id text,
  reembolso_valor numeric(10,2),
  reembolso_motivo text,
  reembolso_por uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_pagamentos_tipo ON pagamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_stripe_pi ON pagamentos(stripe_payment_intent);
CREATE INDEX IF NOT EXISTS idx_pagamentos_ref ON pagamentos(ref_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_created ON pagamentos(created_at DESC);

-- 2. Colunas Stripe nas reservas (se não existirem)
DO $$ BEGIN
  ALTER TABLE reservas ADD COLUMN IF NOT EXISTS stripe_session_id text;
  ALTER TABLE reservas ADD COLUMN IF NOT EXISTS stripe_payment_intent text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 3. Colunas Stripe nos pedidos (se não existirem)
DO $$ BEGIN
  ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS stripe_session_id text;
  ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS stripe_payment_intent text;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- 4. RLS (Row Level Security) para pagamentos
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Admin pode ver e modificar todos os pagamentos
CREATE POLICY "Admin acesso total pagamentos"
  ON pagamentos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.tipo = 'admin'
    )
  );

-- Usuário pode ver seus próprios pagamentos (via email)
CREATE POLICY "Usuario ve seus pagamentos"
  ON pagamentos FOR SELECT
  TO authenticated
  USING (
    email_cliente = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 5. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_pagamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pagamentos_updated_at ON pagamentos;
CREATE TRIGGER pagamentos_updated_at
  BEFORE UPDATE ON pagamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_pagamentos_updated_at();
