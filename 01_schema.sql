CREATE TABLE clientes {
    id SERIAL PRIMARY KEY,
    nombre VARCHAR (100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
};

CREATE TABLE productos {
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
}

CREATE TABLE pedidos {
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
}

CREATE TABLE pedido_items {
    id SERIAL PRIMARY KEY
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
}

