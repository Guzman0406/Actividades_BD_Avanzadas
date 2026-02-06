-- VISTAS: clientes_vip, v_ranking_usuarios_por_gasto
-- Indices Ordinarios
CREATE INDEX idx_ordenes_usuario_id ON ordenes (usuario_id);
CREATE INDEX idx_ordenes_estado ON ordenes (estado);

-- VISTAS: v_ventas_por_categorias
-- Indice Ordinario
CREATE INDEX idx_productos_categoria_id ON productos (categoria_id);

-- VISTAS: v_productos_mas_vendidos
-- Indice Ordinario
CREATE INDEX idx_ordenes_producto_id ON ordenes (producto_id);

-- COMPOSITE INDEXES: Para consultas que filtran y agrupan por las mismas columnas.
-- Indice Compuesto
CREATE INDEX idx_ordenes_usuario_estado ON ordenes (usuario_id, estado);
CREATE INDEX idx_ordenes_producto_estado ON ordenes (producto_id, estado);

