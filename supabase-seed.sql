-- ============================================
-- CLINICHUB — SEED DE DADOS INICIAIS
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- SALAS (status: 'Disponivel', 'Ocupada', 'Manutencao')
INSERT INTO salas (nome, tipo, andar, preco_hora, status, equipamentos) VALUES
  ('Consultorio 1A', 'consultorio', '1', 90.00, 'Disponivel', ARRAY['Maca', 'Negatoscopio', 'Ar-condicionado']),
  ('Consultorio 1B', 'consultorio', '1', 90.00, 'Disponivel', ARRAY['Maca', 'Balanca digital', 'Ar-condicionado']),
  ('Consultorio 2A', 'consultorio', '2', 110.00, 'Disponivel', ARRAY['Maca', 'Otoscopio', 'Esfigmomanometro']),
  ('Consultorio 3A', 'consultorio', '3', 120.00, 'Ocupada', ARRAY['Maca', 'Cadeira odontologica', 'Raio-X intraoral']),
  ('Sala Cirurgica 1', 'cirurgica', '2', 450.00, 'Disponivel', ARRAY['Mesa cirurgica', 'Foco cirurgico', 'Monitor multiparametrico', 'Bisturi eletrico']),
  ('Sala Cirurgica 2', 'cirurgica', '2', 480.00, 'Manutencao', ARRAY['Mesa cirurgica', 'Foco cirurgico', 'Monitor multiparametrico', 'Ventilador mecanico']),
  ('Sala de Exames 1', 'exame', '1', 200.00, 'Disponivel', ARRAY['Ultrassom', 'Maca', 'Monitor', 'Impressora de laudos']),
  ('Sala de Exames 2', 'exame', '1', 250.00, 'Disponivel', ARRAY['Ecocardiografo', 'Ergometrica', 'Monitor ECG']),
  ('Sala de Reuniao', 'reuniao', '3', 60.00, 'Disponivel', ARRAY['TV 65pol', 'Webcam', 'Quadro branco', 'Wi-Fi dedicado']),
  ('Coworking Medico', 'coworking', '3', 35.00, 'Disponivel', ARRAY['Estacao de trabalho', 'Monitor', 'Wi-Fi', 'Cafe']);

-- PRODUTOS (coluna: foto_url, sem destaque)
INSERT INTO produtos (nome, slug, descricao, preco, estoque, categoria, foto_url) VALUES
  ('Estetoscopio Littmann Classic III', 'estetoscopio-littmann-classic-iii', 'Estetoscopio de alta performance com membrana dupla. Ideal para cardiologia e clinica geral.', 899.90, 25, 'Equipamentos', 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80'),
  ('Esfigmomanometro Digital Omron', 'esfigmomanometro-digital-omron', 'Medidor de pressao arterial digital automatico com bracadeira universal.', 289.90, 40, 'Equipamentos', 'https://images.unsplash.com/photo-1559757175-7cb036e0e55d?w=400&q=80'),
  ('Otoscopio Welch Allyn', 'otoscopio-welch-allyn', 'Otoscopio profissional com iluminacao LED e 5 especulos reutilizaveis.', 1249.00, 12, 'Equipamentos', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80'),
  ('Jaleco Branco Premium', 'jaleco-branco-premium', 'Jaleco de microfibra premium com bolsos internos e punho elastico.', 159.90, 80, 'Vestuario', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80'),
  ('Luvas de Procedimento cx100', 'luvas-procedimento-cx100', 'Luvas de nitrilo azul sem po tamanho M. Caixa com 100 unidades.', 49.90, 200, 'Descartaveis', 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80'),
  ('Mascara Cirurgica Tripla cx50', 'mascara-cirurgica-tripla-cx50', 'Mascara descartavel tripla camada com clip nasal. Caixa com 50 unidades.', 29.90, 300, 'Descartaveis', 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&q=80'),
  ('Oximetro de Pulso Portatil', 'oximetro-pulso-portatil', 'Oximetro de dedo com display OLED medicao de SpO2 e frequencia cardiaca.', 89.90, 55, 'Equipamentos', 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80'),
  ('Termometro Infravermelho', 'termometro-infravermelho', 'Termometro digital sem contato com leitura em 1 segundo.', 119.90, 45, 'Equipamentos', 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80'),
  ('Cadeira Ergonomica Medica', 'cadeira-ergonomica-medica', 'Cadeira giratoria com encosto ajustavel apoio lombar e rodizios silenciosos.', 1890.00, 8, 'Mobiliario', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&q=80'),
  ('Maca Clinica Regulavel', 'maca-clinica-regulavel', 'Maca com regulagem de altura e inclinacao estofado lavavel em courvin.', 2450.00, 5, 'Mobiliario', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80'),
  ('Kit Sutura Pratica', 'kit-sutura-pratica', 'Kit de treinamento com pele sintetica porta-agulha e fios de sutura.', 189.90, 30, 'Educacao', 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80'),
  ('Aparelho de Pressao Aneroid', 'aparelho-pressao-aneroid', 'Esfigmomanometro aneroid com estetoscopio acoplado bracadeira adulto em nylon.', 149.90, 35, 'Equipamentos', 'https://images.unsplash.com/photo-1559757175-7cb036e0e55d?w=400&q=80');
