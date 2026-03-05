-- Insertar Usuarios de prueba
INSERT INTO usuario (nombre, email, password) VALUES
('Juan Perez', 'juan.perez@email.com', 'password123'),
('Maria Garcia', 'maria.garcia@email.com', 'securepass'),
('Carlos Lopez', 'carlos.lopez@email.com', 'carlos2024'),
('Ana Martinez', 'ana.martinez@email.com', 'ana_pass'),
('Luis Rodriguez', 'luis.rod@email.com', 'luis_123');

-- Insertar Productos de prueba
INSERT INTO productos (nombre, precio, stock) VALUES
('Laptop Gamer', 1200.00, 10),
('Mouse Inalámbrico', 25.50, 50),
('Teclado Mecánico', 75.00, 30),
('Monitor 27 Pulgadas', 300.00, 15),
('Audífonos Noise Cancelling', 150.00, 20),
('Impresora Multifuncional', 180.00, 8),
('Silla Ergonómica', 250.00, 12),
('Escritorio de Madera', 400.00, 5),
('Cámara Web HD', 45.00, 40),
('Smartphone Alpha', 850.00, 25);

-- Insertar algunas Órdenes de prueba
INSERT INTO ordenes (usuario_id, total) VALUES
(1, 1225.50),
(2, 75.00),
(3, 495.00),
(4, 850.00),
(5, 45.00);
