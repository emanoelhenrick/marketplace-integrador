-- Seed users from frontend/db.json.
INSERT INTO "users" ("id", "name", "email", "role", "avatarUrl", "phone", "password", "createdAt", "updatedAt", "craft", "craftYears", "quote", "location", "polo", "region", "totalWorks") VALUES
('1', 'João Silva', 'joao.silva@email.com', 'client', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', '(81) 98888-1111', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-01-15T10:30:00Z', '2026-01-15T10:30:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('2', 'Maria Oliveira', 'maria.oliveira@email.com', 'client', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', '(81) 99777-2222', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-02-01T14:20:00Z', '2026-02-01T14:20:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3', 'Carlos Eduardo Santos', 'carlos.santos@email.com', 'client', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', '(81) 99666-3333', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-02-10T11:15:00Z', '2026-02-10T11:15:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4', 'Ana Beatriz Lima', 'ana.lima@email.com', 'client', 'https://images.unsplash.com/photo-1580489944761-15a19d654956', '(81) 99555-4444', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-02-18T09:40:00Z', '2026-02-18T09:40:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5', 'Fernando Mendonça', 'fernando.mendonca@email.com', 'client', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61', '(81) 99444-5555', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2026-03-01T16:05:00Z', '2026-03-01T16:05:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('101', 'Mestre Manuel Eudócio', 'eudocio@barro.com.br', 'artisan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', '(81) 99111-3333', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-11-10T08:00:00Z', '2025-11-10T08:00:00Z', 'Cerâmica & Barro', '45 anos de ofício', 'Moldar o barro é dar forma à história do nosso sertão.', 'Alto do Moura, Caruaru - PE', 'Polo Mestre Vitalino', 'Agreste', 48),
('102', 'Dona Maria das Rendas', 'maria.renascenca@email.com', 'artisan', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', '(81) 99222-4444', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-12-01T09:15:00Z', '2025-12-01T09:15:00Z', 'Rendas & Bordados', '30 anos de tradição', 'Cada ponto da renda Renascença guarda a paciência e o amor da rendeira.', 'Poção - PE', 'Polo das Rendeiras', 'Agreste', 32),
('103', 'Mestre J. Borges', 'ateliere@jborges.com.br', 'artisan', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', '(81) 99333-5555', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-10-05T11:00:00Z', '2025-10-05T11:00:00Z', 'Xilogravura & Cordel', '50 anos de poesia', 'A madeira entalhada conta a poesia do povo nordestino.', 'Bezerros - PE', 'Polo Gravatá e Bezerros', 'Agreste', 85),
('104', 'Mestre Saôba', 'saoba.madeira@email.com', 'artisan', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e', '(81) 99444-6666', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-09-12T14:30:00Z', '2025-09-12T14:30:00Z', 'Escultura em Madeira', '38 anos de arte', 'As formas sagradas e os papangus já estão escondidos na madeira, eu só tiro o excesso.', 'Olinda - PE', 'Polo de Olinda e Recife', 'Metropolitana', 29),
('105', 'Dona Maria de Nuca', 'nuca.tracunhaem@email.com', 'artisan', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604', '(81) 99555-7777', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-08-20T10:00:00Z', '2025-08-20T10:00:00Z', 'Cerâmica & Barro', '40 anos de barro', 'O leão de Tracunhaém com seus caracóis de barro é o guardião da nossa cultura.', 'Tracunhaém - PE', 'Polo Zona da Mata Norte', 'Zona da Mata', 54),
('106', 'Mestre Zé Alves', 'zealves.couro@email.com', 'artisan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', '(87) 99666-8888', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-07-15T16:20:00Z', '2025-07-15T16:20:00Z', 'Arte em Couro', '28 anos de vaquejada', 'O couro costurado à mão veste a resistência do sertanejo.', 'Salgueiro - PE', 'Polo Central do Sertão', 'Sertão', 21),
('107', 'Mestre Nicola', 'nicola.petrolina@email.com', 'artisan', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7', '(87) 99777-9999', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-06-01T08:45:00Z', '2025-06-01T08:45:00Z', 'Escultura em Madeira', '35 anos de Velho Chico', 'Minhas carrancas protegem as águas do São Francisco e a alma dos ribeirinhos.', 'Petrolina - PE', 'Polo Vale do São Francisco', 'Sertão', 40),
('900', 'Administração Manoa', 'admin@manoa.com.br', 'admin', NULL, '(81) 3000-0000', '$2b$10$YLJ56QpH2tpsTKGLkuhuKeM5raY3dCtUah3/51zcGA/.iktGEba72', '2025-09-01T08:00:00Z', '2025-09-01T08:00:00Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT ("id") DO NOTHING;

-- Seed the catalog and the product IDs referenced by frontend orders.
INSERT INTO "products" ("id", "name", "price", "stars", "category", "artisan", "location", "image", "description", "quantity", "active", "createdAt", "updatedAt") VALUES
(1, 'Casal de Noivos de Barro', 180.00, 4.8, 'Cerâmica & Barro', 'Mestre Vitalino (Família)', 'Alto do Moura / Caruaru', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80', 'Modelagem figurativa em argila queimada a lenha, retratando o cotidiano e as tradições do agreste pernambucano.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Toalha em Renda Renascença', 450.00, 5.0, 'Rendas & Bordados', 'Associação de Rendeiras', 'Poção / PE', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80', 'Trama milimétrica confeccionada manualmente em almofada de bilro com fios de algodão puro.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Matriz de Xilogravura - O Frevo', 220.00, 4.9, 'Xilogravura & Cordel', 'Mestre J. Borges', 'Bezerros / PE', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80', 'Impressão original tirada de matriz de umburana entalhada à mão com pigmento preto em papel de gramatura especial.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Carranca Protetora em Cedro', 620.00, 4.7, 'Madeira & Entalhe', 'Mestre Saúba', 'Jaboatão dos Guararapes / PE', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', 'Escultura folclórica entalhada em bloco único de madeira nobre restaurada com acabamento em cera natural.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Santo Antônio de Barro Pintado', 140.00, 4.5, 'Cerâmica & Barro', 'Mestra Ana das Carrancas', 'Petrolina / PE', 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&auto=format&fit=crop&q=80', 'Arte sacra popular moldada à mão com traços marcantes e olhos vazados, marca registrada do São Francisco.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Máscara de Papangú de Bezerros', 110.00, 4.3, 'Máscaras & Carnaval', 'Ateliê Papangú', 'Bezerros / PE', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', 'Máscara tradicional de papel machê e tinta acrílica feita para o carnaval do Agreste pernambucano.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Colcha em Patchwork & Fuxico', 380.00, 4.6, 'Rendas & Têxtil', 'Coletivo Rendeiras de Passira', 'Passira / PE', 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80', 'Trabalho manual de reaproveitamento de retalhos coloridos unindo centenas de fuxicos em padrões florais.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Ex-Voto de Madeira Entalhada', 195.00, 4.4, 'Madeira & Entalhe', 'Mestre Nena', 'Tracunhaém / PE', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 'Peça devocional esculpida em umburana representando o agradecimento a promessas e fé popular.', 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Vaso Utilitário em Argila Vermelha', 160.00, 5.0, 'Cerâmica & Barro', 'Mestre Manuel Eudócio', 'Caruaru', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(201, 'Produto do pedido 1001', 180.00, 0.0, 'Cerâmica & Barro', 'Mestre Manuel Eudócio', 'Alto do Moura, Caruaru - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(207, 'Produto do pedido 1001', 150.00, 0.0, 'Xilogravura & Cordel', 'Mestre J. Borges', 'Bezerros - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(204, 'Produto do pedido 1002', 450.00, 0.0, 'Rendas & Bordados', 'Dona Maria das Rendas', 'Poção - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(212, 'Produto do pedido 1003', 580.00, 0.0, 'Cerâmica & Barro', 'Dona Maria de Nuca', 'Tracunhaém - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(210, 'Produto do pedido 1003', 260.00, 0.0, 'Escultura em Madeira', 'Mestre Saôba', 'Olinda - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(214, 'Produto do pedido 1003', 210.00, 0.0, 'Arte em Couro', 'Mestre Zé Alves', 'Salgueiro - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(216, 'Produto do pedido 1004', 640.00, 0.0, 'Escultura em Madeira', 'Mestre Nicola', 'Petrolina - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(208, 'Produto do pedido 1004', 180.00, 0.0, 'Xilogravura & Cordel', 'Mestre J. Borges', 'Bezerros - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(215, 'Produto do pedido 1005', 750.00, 0.0, 'Arte em Couro', 'Mestre Zé Alves', 'Salgueiro - PE', NULL, NULL, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Keep the serial sequence above the explicit product IDs.
SELECT setval(pg_get_serial_sequence('products', 'id'), GREATEST((SELECT MAX("id") FROM "products"), 1), true);

INSERT INTO "orders" ("id", "userId", "customerName", "customerEmail", "status", "totalAmount", "createdAt", "updatedAt") VALUES
('1001', '1', 'João Silva', 'joao.silva@email.com', 'paid', 330.00, '2026-03-20T14:00:00Z', '2026-03-20T14:00:00Z'),
('1002', '2', 'Maria Oliveira', 'maria.oliveira@email.com', 'shipped', 450.00, '2026-03-22T16:45:00Z', '2026-03-22T16:45:00Z'),
('1003', '3', 'Carlos Eduardo Santos', 'carlos.santos@email.com', 'delivered', 1050.00, '2026-03-15T10:20:00Z', '2026-03-15T10:20:00Z'),
('1004', '4', 'Ana Beatriz Lima', 'ana.lima@email.com', 'paid', 820.00, '2026-03-23T11:10:00Z', '2026-03-23T11:10:00Z'),
('1005', '5', 'Fernando Mendonça', 'fernando.mendonca@email.com', 'pending', 750.00, '2026-03-25T08:30:00Z', '2026-03-25T08:30:00Z')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "order_items" ("id", "orderId", "productId", "artisanId", "quantity", "unitPrice", "packed", "createdAt", "updatedAt") VALUES
('1001-1', '1001', 201, '101', 1, 180.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1001-2', '1001', 207, '103', 1, 150.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1002-1', '1002', 204, '102', 1, 450.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1003-1', '1003', 212, '105', 1, 580.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1003-2', '1003', 210, '104', 1, 260.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1003-3', '1003', 214, '106', 1, 210.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1004-1', '1004', 216, '107', 1, 640.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1004-2', '1004', 208, '103', 1, 180.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('1005-1', '1005', 215, '106', 1, 750.00, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;