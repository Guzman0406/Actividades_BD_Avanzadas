-- INSERTAR CLIENTE
CREATE OR REPLACE PROCEDURE sp_crear_cliente(IN nombre VARCHAR(100), IN email VARCHAR(100), OUT id INT) 
LANGUAGE plpgsql AS $$
BEGIN

    INSERT INTO clientes (nombre, email) VALUES (nombre, email)
    RETURNING id INTO id;

    RAISE NOTICE 'Cliente creado exitosamente con ID: %', id;

EXCEPTION
   WHEN unique_violation THEN -- unique_violation para cuando no se cumpla la restricción UNIQUE
        RAISE NOTICE 'El correo % ya existe', email; 
        RETURN;

    WHEN OTHERS THEN 
        RAISE NOTICE 'Error al crear el cliente: %', SQLERRM; -- SQLERRM indica el error exacto por el cual falló
        RETURN;

END;
$$;



-- PROCESAR PEDIDO (validar stock, crear pedido, actualizar stock, mensaje) (manejo de errores)
CREATE OR REPLACE PROCEDURE sp_procesar_pedido (IN cliente_id INT, IN productos_json JSONB, OUT pedido_id INT)
LANGUAGE plpgsql AS $$
DECLARE
    total_acumulado DECIMAL(10, 2) := 0;
    datos_producto RECORD;
    precio_producto DECIMAL(10, 2);
    stock_actual INT;
BEGIN

-- Crear pedido    
INSERT INTO pedidos (cliente_id, total) VALUES (cliente_id, 0) RETURNING id INTO pedido_id;

-- Iterar sobre el JSON
-- jsonb_to_recordset convierte el JSON en filas
-- AS x() (x es el nombre de la tabla temporal)
-- (producto_id INT, cantidad INT) define los tipos de datos
FOR datos_producto IN SELECT * FROM jsonb_to_recordset(productos_json) AS x(producto_id INT, cantidad INT)
LOOP
-- Obtener el precio y stock
SELECT precio, stock INTO precio_producto, stock_actual FROM productos 
WHERE id = datos_producto.producto_id;

-- Validamos si hay stock
IF stock_actual < datos_producto.cantidad THEN
RAISE EXCEPTION 'No hay stock para el producto con id: %', datos_producto.producto_id;
END IF;

-- Insertar los detalles
INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio)
VALUES (pedido_id, datos_producto.producto_id, datos_producto.cantidad, precio_producto);

-- Actualizar el stock 
UPDATE productos SET stock = stock - datos_producto.cantidad
WHERE id = datos_producto.producto_id;

-- Sumar al total
total_acumulado := total_acumulado + (precio_producto * datos_producto.cantidad);
END LOOP;

-- Actualizar el total real
UPDATE pedidos SET total = total_acumulado WHERE id = pedido_id;
RAISE NOTICE 'Pedido número: % procesado con éxito y total: %', pedido_id, total_acumulado;

EXCEPTION
WHEN OTHERS THEN 
RAISE NOTICE 'ERROR: %', SQLERRM;
pedido_id := NULL;

END; $$;