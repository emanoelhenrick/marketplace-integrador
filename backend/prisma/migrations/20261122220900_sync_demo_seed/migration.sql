-- Normalize demo emails.
UPDATE "users"
SET "email" = LOWER(BTRIM("email"))
WHERE "email" <> LOWER(BTRIM("email"));

-- Demo users.
INSERT INTO "users" (
  "id", "name", "email", "role", "active", "avatarUrl", "phone", "password",
  "createdAt", "updatedAt", "craft", "craftYears", "quote", "location", "polo",
  "region", "totalWorks", "culturalSeal"
) VALUES
('demo-client-1', 'Camila Ferreira', 'camila@demo.manoa.com.br', 'client', true, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', '(81) 99100-0001', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-06-02T10:00:00Z', '2026-06-02T10:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true),
('demo-client-2', 'Rafael Albuquerque', 'rafael@demo.manoa.com.br', 'client', true, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', '(81) 99100-0002', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-06-15T14:30:00Z', '2026-06-15T14:30:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true),
('demo-client-3', 'Juliana Cavalcanti', 'juliana@demo.manoa.com.br', 'client', true, 'https://images.unsplash.com/photo-1580489944761-15a19d654956', '(81) 99100-0003', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-07-20T09:15:00Z', '2026-07-20T09:15:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true),
('demo-artisan-1', 'Mestre Zé do Barro', 'ze.barro@demo.manoa.com.br', 'artisan', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', '(81) 99200-0001', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-05-01T08:00:00Z', '2026-05-01T08:00:00Z', 'Cerâmica Figurativa', '42 anos de ofício', 'O barro do Alto do Moura guarda a memória do nosso povo; cada figura conta uma história do agreste.', 'Alto do Moura / Caruaru', 'Polo de Cerâmica do Alto do Moura', 'Agreste', 120, true),
('demo-artisan-2', 'Dona Rita Rendeira', 'rita.renda@demo.manoa.com.br', 'artisan', true, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', '(87) 99200-0002', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-05-05T08:30:00Z', '2026-05-05T08:30:00Z', 'Renda Renascença', '35 anos de bilro', 'Cada ponto é feito à mão, no ritmo do bilro, como me ensinou minha avó.', 'Poção / PE', 'Polo de Rendas do Agreste', 'Agreste', 85, true),
('demo-artisan-3', 'Mestre Antônio Xilo', 'antonio.xilo@demo.manoa.com.br', 'artisan', true, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', '(81) 99200-0003', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-05-10T09:00:00Z', '2026-05-10T09:00:00Z', 'Xilogravura e Cordel', '38 anos de entalhe', 'Da madeira nasce a imagem, e da imagem nasce o cordel que o povo lê.', 'Bezerros / PE', 'Polo de Xilogravura de Bezerros', 'Agreste', 200, true),
('demo-artisan-4', 'Mestre Chico Carranqueiro', 'chico.carranca@demo.manoa.com.br', 'artisan', true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', '(87) 99200-0004', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-05-15T08:45:00Z', '2026-05-15T08:45:00Z', 'Escultura em Madeira', '30 anos de Velho Chico', 'As carrancas protegem os barqueiros e a alma de quem vive do rio São Francisco.', 'Petrolina / PE', 'Polo Vale do São Francisco', 'Sertão', 60, true),
('demo-artisan-5', 'Mestra Lourdes do Fuxico', 'lourdes.fuxico@demo.manoa.com.br', 'artisan', false, 'https://images.unsplash.com/photo-1580489944761-15a19d654956', '(81) 99200-0005', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-05-20T10:00:00Z', '2026-05-20T10:00:00Z', 'Têxtil e Fuxico', '20 anos de agulha', 'Retalho nenhum se perde quando há mão paciente para transformá-lo.', 'Olinda / PE', 'Polo Têxtil da Zona da Mata', 'Zona da Mata', 45, false),
('demo-admin-1', 'Administração Demo', 'admin@demo.manoa.com.br', 'admin', true, NULL, '(81) 3000-0001', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-04-01T08:00:00Z', '2026-04-01T08:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "email" = EXCLUDED."email",
  "role" = EXCLUDED."role",
  "active" = EXCLUDED."active",
  "avatarUrl" = EXCLUDED."avatarUrl",
  "phone" = EXCLUDED."phone",
  "password" = EXCLUDED."password",
  "craft" = EXCLUDED."craft",
  "craftYears" = EXCLUDED."craftYears",
  "quote" = EXCLUDED."quote",
  "location" = EXCLUDED."location",
  "polo" = EXCLUDED."polo",
  "region" = EXCLUDED."region",
  "totalWorks" = EXCLUDED."totalWorks",
  "culturalSeal" = EXCLUDED."culturalSeal",
  "updatedAt" = EXCLUDED."updatedAt";

-- Demo products.
INSERT INTO "products" (
  "id", "name", "price", "stars", "category", "technique", "artisan",
  "artisanId", "location", "image", "description", "quantity", "active",
  "createdAt", "updatedAt"
) VALUES
(301, 'Casal de Noivos em Barro', 180.00, 4.8, 'Cerâmica & Barro', 'Modelagem em barro', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80', 'Figura de um casal de noivos modelada à mão em argila e queimada a lenha.', 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(302, 'Cena de Feira em Barro', 260.00, 4.6, 'Cerâmica & Barro', 'Modelagem em barro', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 'Pequeno diorama com feirantes e bancas do agreste.', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(303, 'Moringa Tradicional', 95.00, 4.4, 'Cerâmica & Barro', 'Torno e queima a lenha', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80', 'Moringa de barro cru que mantém a água fresca.', 25, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(304, 'Sanfoneiro de Barro', 140.00, 4.7, 'Cerâmica & Barro', 'Modelagem em barro', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 'Figura de sanfoneiro em tamanho médio.', 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(305, 'Presépio Pernambucano (Esgotado)', 390.00, 4.9, 'Cerâmica & Barro', 'Modelagem em barro', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80', 'Conjunto de nove peças em barro.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(306, 'Vaso Marajoara Pintado (Inativo)', 120.00, 0.0, 'Cerâmica & Barro', 'Pintura em engobe', 'Mestre Zé do Barro', 'demo-artisan-1', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 'Vaso decorativo com grafismos inspirados na cerâmica marajoara.', 6, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(307, 'Toalha de Mesa em Renda Renascença', 450.00, 4.9, 'Rendas & Bordados', 'Renda renascença', 'Dona Rita Rendeira', 'demo-artisan-2', 'Poção / PE', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80', 'Toalha confeccionada manualmente em almofada de bilro.', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(308, 'Caminho de Mesa Bordado', 210.00, 4.5, 'Rendas & Bordados', 'Bordado richelieu', 'Dona Rita Rendeira', 'demo-artisan-2', 'Poção / PE', 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80', 'Caminho de mesa em linho com bordado richelieu.', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(309, 'Jogo de Guardanapos Rendados', 150.00, 4.6, 'Rendas & Têxtil', 'Renda renascença', 'Dona Rita Rendeira', 'demo-artisan-2', 'Poção / PE', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80', 'Conjunto com seis guardanapos de algodão.', 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(310, 'Blusa em Renda Artesanal', 320.00, 4.8, 'Rendas & Têxtil', 'Renda renascença', 'Dona Rita Rendeira', 'demo-artisan-2', 'Poção / PE', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80', 'Blusa feminina com detalhes em renda feitos à mão.', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(311, 'Colcha de Cama Casal (Esgotada)', 980.00, 5.0, 'Rendas & Bordados', 'Bordado richelieu', 'Dona Rita Rendeira', 'demo-artisan-2', 'Poção / PE', 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80', 'Colcha em algodão cru com bordado richelieu.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(312, 'Xilogravura - O Frevo', 220.00, 4.9, 'Xilogravura & Cordel', 'Xilogravura em umburana', 'Mestre Antônio Xilo', 'demo-artisan-3', 'Bezerros / PE', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Impressão original tirada de matriz de umburana entalhada à mão.', 18, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(313, 'Xilogravura - Cangaceiros', 240.00, 4.7, 'Xilogravura & Cordel', 'Xilogravura em umburana', 'Mestre Antônio Xilo', 'demo-artisan-3', 'Bezerros / PE', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Gravura em preto e branco inspirada nas histórias do cangaço.', 14, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(314, 'Cordel Ilustrado - Lendas do Sertão', 25.00, 4.5, 'Xilogravura & Cordel', 'Impressão tipográfica', 'Mestre Antônio Xilo', 'demo-artisan-3', 'Bezerros / PE', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Folheto de cordel com capa xilogravada.', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(315, 'Matriz de Xilogravura Original', 700.00, 4.8, 'Xilogravura & Cordel', 'Entalhe em madeira', 'Mestre Antônio Xilo', 'demo-artisan-3', 'Bezerros / PE', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Matriz em madeira entalhada à mão.', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(316, 'Kit de Cartões Xilogravados (Esgotado)', 60.00, 4.3, 'Xilogravura & Cordel', 'Xilogravura em umburana', 'Mestre Antônio Xilo', 'demo-artisan-3', 'Bezerros / PE', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Cartões com gravuras originais e envelopes reciclados.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(317, 'Carranca Protetora em Cedro', 620.00, 4.7, 'Madeira & Entalhe', 'Entalhe em cedro', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Escultura entalhada em bloco único de cedro.', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(318, 'Carranca Pequena de Mesa', 280.00, 4.4, 'Madeira & Entalhe', 'Entalhe em cedro', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Versão compacta da carranca do São Francisco.', 11, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(319, 'Máscara de Caboclo de Lança', 340.00, 4.6, 'Máscaras & Carnaval', 'Papel machê', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', 'Máscara em papel machê inspirada no maracatu rural.', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(320, 'Boneco de Olinda em Madeira', 190.00, 4.5, 'Madeira & Entalhe', 'Entalhe e pintura', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', 'Boneco articulado em madeira leve e pintado à mão.', 16, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(321, 'Tábua de Corte em Madeira Nobre', 130.00, 4.2, 'Madeira & Entalhe', 'Marcenaria artesanal', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Tábua de corte em madeira de reflorestamento.', 30, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(322, 'Cavalo-Marinho em Miniatura', 160.00, 4.6, 'Máscaras & Carnaval', 'Entalhe e pintura', 'Mestre Chico Carranqueiro', 'demo-artisan-4', 'Petrolina / PE', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', 'Miniatura do cavalo-marinho do folguedo pernambucano.', 13, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(323, 'Manta de Fuxico', 350.00, 4.5, 'Rendas & Têxtil', 'Fuxico', 'Mestra Lourdes do Fuxico', 'demo-artisan-5', 'Olinda / PE', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80', 'Manta feita com centenas de fuxicos reaproveitados.', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(324, 'Bolsa de Retalhos', 110.00, 4.1, 'Rendas & Têxtil', 'Patchwork', 'Mestra Lourdes do Fuxico', 'demo-artisan-5', 'Olinda / PE', 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80', 'Bolsa em patchwork de retalhos de algodão.', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "price" = EXCLUDED."price",
  "stars" = EXCLUDED."stars",
  "category" = EXCLUDED."category",
  "technique" = EXCLUDED."technique",
  "artisan" = EXCLUDED."artisan",
  "artisanId" = EXCLUDED."artisanId",
  "location" = EXCLUDED."location",
  "image" = EXCLUDED."image",
  "description" = EXCLUDED."description",
  "quantity" = EXCLUDED."quantity",
  "active" = EXCLUDED."active",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Keep the serial sequence above demo product ids.
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX("id") FROM "products"), 1), true);
