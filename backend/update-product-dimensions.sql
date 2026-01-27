-- 📦 SQL PARA ATUALIZAR DIMENSÕES DOS PERFUMES NO SUPABASE
-- Execute esta query no Supabase SQL Editor
-- 
-- Padrão definido para todos os perfumes:
-- - Peso: 0,35 kg
-- - Altura: 15 cm
-- - Largura: 10 cm
-- - Comprimento: 6 cm

-- ⚠️ IMPORTANTE: Faça backup antes de executar!

-- ===== OPÇÃO 1: ATUALIZAR TODOS OS PRODUTOS (RECOMENDADO) =====
-- Execute esta query para atualizar todos os produtos com os padrões

UPDATE products
SET 
  weight = 0.35,
  height = 15,
  width = 10,
  length = 6,
  updated_at = NOW()
WHERE 
  weight IS NULL 
  OR weight = 0
  OR height IS NULL
  OR height = 0
  OR width IS NULL
  OR width = 0
  OR length IS NULL
  OR length = 0;

-- Mostrar quantos registros foram atualizados
SELECT 
  COUNT(*) as total_atualizados,
  COUNT(CASE WHEN weight = 0.35 THEN 1 END) as com_padroes_corretos
FROM products
WHERE weight = 0.35 
  AND height = 15 
  AND width = 10 
  AND length = 6;

-- ===== OPÇÃO 2: VERIFICAR DADOS ATUAIS (EXECUTA PRIMEIRO!) =====
-- Execute isto antes para ver o status atual:

SELECT 
  id,
  name,
  weight,
  height,
  width,
  length,
  CASE 
    WHEN weight IS NULL OR weight = 0 THEN '❌ Sem peso'
    WHEN height IS NULL OR height = 0 THEN '❌ Sem altura'
    WHEN width IS NULL OR width = 0 THEN '❌ Sem largura'
    WHEN length IS NULL OR length = 0 THEN '❌ Sem comprimento'
    ELSE '✅ Completo'
  END as status
FROM products
ORDER BY name;

-- ===== OPÇÃO 3: ATUALIZAR APENAS ALGUNS PRODUTOS (POR ID) =====
-- Se quiser atualizar apenas produtos específicos, use esta query:
-- Descomente e modifique os IDs conforme necessário

/*
UPDATE products
SET 
  weight = 0.35,
  height = 15,
  width = 10,
  length = 6,
  updated_at = NOW()
WHERE id IN (
  'id1-aqui',
  'id2-aqui',
  'id3-aqui'
);
*/

-- ===== OPÇÃO 4: ATUALIZAR APENAS PRODUTOS COM DETERMINADA CATEGORIA =====
-- Se quiser atualizar apenas perfumes de uma categoria específica:

/*
UPDATE products
SET 
  weight = 0.35,
  height = 15,
  width = 10,
  length = 6,
  updated_at = NOW()
WHERE category_id = 'sua-category-id-aqui'
  AND (weight IS NULL OR weight = 0);
*/

-- ===== VALIDAÇÃO FINAL =====
-- Execute isto para garantir que todos os produtos têm dimensões:

SELECT 
  COUNT(*) as total_produtos,
  COUNT(CASE WHEN weight IS NOT NULL AND weight > 0 THEN 1 END) as com_peso,
  COUNT(CASE WHEN height IS NOT NULL AND height > 0 THEN 1 END) as com_altura,
  COUNT(CASE WHEN width IS NOT NULL AND width > 0 THEN 1 END) as com_largura,
  COUNT(CASE WHEN length IS NOT NULL AND length > 0 THEN 1 END) as com_comprimento
FROM products;

-- Se todos os números forem iguais, significa que todos os produtos estão com dimensões corretas ✅
