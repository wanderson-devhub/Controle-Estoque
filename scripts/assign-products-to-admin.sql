-- Assign existing products to the current admin
UPDATE products SET adminId = (SELECT id FROM users WHERE isAdmin = 1 LIMIT 1) WHERE adminId IS NULL;
