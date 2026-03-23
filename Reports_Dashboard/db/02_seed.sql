INSERT INTO usuarios (nombre, email, rol) VALUES
('Ana García', 'ana@test.com', 'admin'),
('Carlos López', 'carlos@test.com', 'customer'),
('María Rodriguez', 'maria@test.com', 'customer'),
('Juan Pérez', 'juan@test.com', 'customer'),
('Luisa Martínez', 'luisa@test.com', 'customer');

-- Categorías 
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Gadgets, computadoras y periféricos'),
('Muebles', 'Mobiliario de oficina y ergonomía'),
('Alimentos', 'Bebidas y snacks para programadores');

-- Productos 
INSERT INTO productos (nombre, categoria_id, precio, stock) VALUES
('Laptop Pro', 1, 1200.00, 15),          
('Mouse Inalámbrico', 1, 25.50, 50),     
('Monitor 24"', 1, 180.00, 20),          
('Silla Ergonómica', 2, 150.00, 10),     
('Escritorio de Pie', 2, 300.00, 5),     
('Café en Grano', 3, 15.00, 100);        

-- Órdenes
INSERT INTO ordenes (usuario_id, producto_id, cantidad, monto_total, estado, creado_el) VALUES
(2, 1, 1, 1200.00, 'pendiente', NOW() - INTERVAL '10 days'),
(2, 2, 2, 51.00, 'completado', NOW() - INTERVAL '9 days'),
(3, 4, 1, 150.00, 'pendiente', NOW() - INTERVAL '5 days'),
(3, 6, 5, 75.00, 'completado', NOW() - INTERVAL '2 days'),
(4, 2, 1, 25.50, 'pendiente', NOW()),
(4, 6, 2, 30.00, 'completado', NOW() - INTERVAL '1 day'),
(5, 1, 1, 1200.00, 'pendiente', NOW() - INTERVAL '20 days');