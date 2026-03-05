-- Validar positivos - Trigger 1
INSERT INTO productos (nombre, precio, stock) 
VALUES ('Producto Error', -10.00, 10);

-- Precio - Trigger 2
UPDATE productos SET precio = 1300.00 WHERE id = 1;
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 1;

-- Actualizar fecha de producto - Trigger 3
UPDATE productos SET stock = stock + 5 WHERE id = 1;
SELECT id, nombre, stock, update_at FROM productos WHERE id = 1;

-- Soft-Delete - Trigger 4
DELETE FROM productos WHERE id = 2;
SELECT id, nombre, is_deleted, update_at FROM productos WHERE id = 2;

-- Revisar que todo fue correcto
SELECT count(*) as total_productos FROM productos;
