-- VISTA 1: CLIENTES VIP
/*
 View: v_vip_clientes
 Grain: 1 fila por Usuario.
 Metricas: total_spent (Suma de montos).
 Group By: Para agrupar múltiples órdenes en un solo total por usuario.
 Having: Para mostrar solo usuarios que han comprado algo (gasto > 0).
 Verify: SELECT * FROM v_vip_clientes WHERE status = 'VIP';
*/
CREATE OR REPLACE VIEW v_vip_clientes AS
SELECT 
    u.id,
    u.nombre,
    COALESCE(SUM(o.monto_total), 0) as total_gastado,
    CASE 
        WHEN COALESCE(SUM(o.monto_total), 0) > 1000 THEN 'VIP'
        ELSE 'Regular'
    END as status
FROM usuarios u
LEFT JOIN ordenes o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre
HAVING COALESCE(SUM(o.monto_total), 0) > 0;

-- VISTA 2: VENTAS POR CATEGORÍA
/*
 View: v_ventas_por_categoria
 Grain: 1 fila por Categoría.
 Metricas: Total_ordenes, Ganancias.
 Group By: Para acumular ventas de productos dentro de su categoría
 Having: Solo mostramos las categorías con ventas (Ganancias > 0).
 Verify: SELECT * FROM v_ventas_por_categoria ORDER BY Ganancias DESC;
*/
CREATE OR REPLACE VIEW v_ventas_por_categoria AS
SELECT 
    c.nombre AS Nombre_categoria,
    COUNT(o.id) AS Total_ordenes,
    SUM(o.monto_total) AS Ganancias,
    ROUND((SUM(o.monto_total) / NULLIF(COUNT(o.id), 0)), 2) AS Ticket_promedio
FROM categorias c
JOIN productos p ON c.id = p.categoria_id
JOIN ordenes o ON p.id = o.producto_id
WHERE o.estado = 'completado'
GROUP BY c.nombre
HAVING SUM(o.monto_total) > 0;

-- VISTA 3: PRODUCTOS MÁS VENDIDOS
/*
 View: v_productos_mas_vendidos
 Grain: 1 fila por Producto.
 Metricas: Veces_vendido, Total_cantidad_vendida.
 Why Group By: Agrupar órdenes por producto.
 Uses CTE: 'SalesSummary' pre-calcula los conteos antes del JOIN.
 Verify: SELECT * FROM v_productos_mas_vendidos LIMIT 5;
*/
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
WITH SalesSummary AS (
    SELECT 
        producto_id,
        COUNT(id) AS sales_count, 
        SUM(cantidad) AS quantity_sum
    FROM ordenes 
    WHERE estado = 'completado'
    GROUP BY producto_id
)
SELECT
    p.nombre AS Nombre_producto,
    COALESCE(s.sales_count, 0) AS Veces_vendido,
    COALESCE(s.quantity_sum, 0) AS Total_cantidad_vendida
FROM productos p
JOIN SalesSummary s ON p.id = s.producto_id
ORDER BY s.sales_count DESC;    

-- VISTA 4: RESUMEN DE ÓRDENES POR ESTADO
/*
 View: v_resumen_ordenes_por_estado
 Grain: 1 fila por Estado (pending, completed, etc).
 Metricas: Total_ordenes, Ingresos_totales.
 Group By: Para sumar las métricas por estado.
 Verify: SELECT * FROM v_resumen_ordenes_por_estado;
*/      
CREATE OR REPLACE VIEW v_resumen_ordenes_por_estado AS
SELECT
    o.estado AS Estado_orden,
    COUNT(o.id) AS Total_ordenes,
    SUM(o.monto_total) AS Ingresos_totales
FROM ordenes o
GROUP BY o.estado;  

-- VISTA 5: RANKING DE USUARIOS POR GASTO
/*
 View: v_ranking_usuarios_por_gasto
 Grain: 1 fila por Usuario.
 Metricas: Total_gastado, Rank_global.
 Group By: Obtener el total gastado por usuario único.
 Window Function: RANK() para generar la posición numérica explícita.
 Verify: SELECT * FROM v_ranking_usuarios_por_gasto WHERE Rank_global <= 3;
*/  
CREATE OR REPLACE VIEW v_ranking_usuarios_por_gasto AS
SELECT
    u.nombre AS Nombre_usuario,
    SUM(o.monto_total) AS Total_gastado,
    RANK() OVER (ORDER BY SUM(o.monto_total) DESC) as Rank_global
FROM usuarios u
JOIN ordenes o ON u.id = o.usuario_id
WHERE o.estado = 'completado'
GROUP BY u.nombre;
