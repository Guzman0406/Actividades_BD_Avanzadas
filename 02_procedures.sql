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

