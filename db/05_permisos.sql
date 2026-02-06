CREATE ROLE reportes WITH LOGIN PASSWORD '243715';

-- Dar permisos de conexión a la base de datos
GRANT CONNECT ON DATABASE dashboard TO reportes;

-- Dar permisos sobre el esquema publico
GRANT USAGE ON SCHEMA public TO reportes;

-- Dar permisos sobre lectura de las vistas (completar con el nombre de las Vistas)
GRANT SELECT ON v_vip_clientes TO reportes;
GRANT SELECT ON v_ventas_por_categoria TO reportes;
GRANT SELECT ON v_productos_mas_vendidos TO reportes;
GRANT SELECT ON v_resumen_ordenes_por_estado TO reportes;
GRANT SELECT ON v_ranking_usuarios_por_gasto TO reportes;
