DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente',
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);


CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT REFERENCES categorias(id), 
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    monto_total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
