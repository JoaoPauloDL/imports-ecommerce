-- ===========================================
-- INSERÇÃO DE PRODUTOS - David Importados
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- Inserir produtos (estoque zerado, sem categoria, sem imagens)
INSERT INTO products (id, name, slug, description, price, sku, stock_quantity, is_active, featured, images, created_at, updated_at)
VALUES
  -- Ferrari
  (gen_random_uuid(), 'Ferrari Black', 'ferrari-black', 'Perfume Ferrari Black', 280.00, 'PERF-001', 0, true, false, '{}', NOW(), NOW()),
  
  -- UDV
  (gen_random_uuid(), 'UDV Preto', 'udv-preto', 'Perfume UDV Preto', 130.00, 'PERF-002', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'UDV Marrom', 'udv-marrom', 'Perfume UDV Marrom', 130.00, 'PERF-003', 0, true, false, '{}', NOW(), NOW()),
  
  -- Club de Nuit
  (gen_random_uuid(), 'Club de Nuit', 'club-de-nuit', 'Perfume Club de Nuit Masculino', 400.00, 'PERF-004', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Club de Nuit Rose (Feminino)', 'club-de-nuit-rose-feminino', 'Perfume Club de Nuit Rose Feminino', 400.00, 'PERF-005', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Club Milestone', 'club-milestone', 'Perfume Club Milestone', 400.00, 'PERF-006', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Club Sillage', 'club-sillage', 'Perfume Club Sillage', 400.00, 'PERF-007', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Club Urban', 'club-urban', 'Perfume Club Urban', 400.00, 'PERF-008', 0, true, false, '{}', NOW(), NOW()),
  
  -- Asad
  (gen_random_uuid(), 'Asad Tradicional (Preto)', 'asad-tradicional-preto', 'Perfume Asad Tradicional Preto', 355.00, 'PERF-009', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Asad Bourbon', 'asad-bourbon', 'Perfume Asad Bourbon', 365.00, 'PERF-010', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Asad Elixir (Preto)', 'asad-elixir-preto', 'Perfume Asad Elixir Preto', 400.00, 'PERF-011', 0, true, false, '{}', NOW(), NOW()),
  
  -- Outros
  (gen_random_uuid(), 'Salvo', 'salvo', 'Perfume Salvo', 265.00, 'PERF-012', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Vodka', 'vodka', 'Perfume Vodka', 105.00, 'PERF-013', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Como Moisele', 'como-moisele', 'Perfume Como Moisele', 265.00, 'PERF-014', 0, true, false, '{}', NOW(), NOW()),
  
  -- Fakhar
  (gen_random_uuid(), 'Fakhar Black', 'fakhar-black', 'Perfume Fakhar Black', 355.00, 'PERF-015', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Fakhar Rose', 'fakhar-rose', 'Perfume Fakhar Rose', 355.00, 'PERF-016', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Fakhar Gold', 'fakhar-gold', 'Perfume Fakhar Gold', 355.00, 'PERF-017', 0, true, false, '{}', NOW(), NOW()),
  
  -- Árabes
  (gen_random_uuid(), 'Sabah al Ward', 'sabah-al-ward', 'Perfume Sabah al Ward', 295.00, 'PERF-018', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Khamrah', 'khamrah', 'Perfume Khamrah', 449.00, 'PERF-019', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Yara Rose', 'yara-rose', 'Perfume Yara Rose', 398.00, 'PERF-020', 0, true, false, '{}', NOW(), NOW()),
  
  -- Animale
  (gen_random_uuid(), 'Animale (Masculino)', 'animale-masculino', 'Perfume Animale Masculino', 250.00, 'PERF-021', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Animale (Feminino)', 'animale-feminino', 'Perfume Animale Feminino', 350.00, 'PERF-022', 0, true, false, '{}', NOW(), NOW()),
  
  -- Outros
  (gen_random_uuid(), 'Silver Cent', 'silver-cent', 'Perfume Silver Cent', 265.00, 'PERF-023', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Cabotine', 'cabotine', 'Perfume Cabotine', 220.00, 'PERF-024', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Durrat al Aroos', 'durrat-al-aroos', 'Perfume Durrat al Aroos', 300.00, 'PERF-025', 0, true, false, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Bareeq', 'bareeq', 'Perfume Bareeq', 285.00, 'PERF-026', 0, true, false, '{}', NOW(), NOW()),
  
  -- PRODUTO DE TESTE (para testar pagamento)
  (gen_random_uuid(), '[TESTE] Produto para Teste de Pagamento', 'teste-pagamento', 'Produto apenas para teste do sistema de pagamento. NÃO COMPRAR.', 1.00, 'TESTE-001', 999, false, false, '{}', NOW(), NOW());

-- ===========================================
-- VERIFICAÇÃO
-- ===========================================
-- Execute após inserir para confirmar:
-- SELECT name, price, stock_quantity FROM products ORDER BY created_at DESC LIMIT 30;
