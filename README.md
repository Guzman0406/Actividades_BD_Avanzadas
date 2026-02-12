# Dashboard de Reportes ( Tarea 6: PostgreSQL + Views + Docker Compose)
Este proyecto se trata de una aplicación web creada con Next.js para visualizar reportes de ventas obtenidos de vistas SQL en una base de datos. Todo el sistema se ejecuta mediante Docker para una mejor facilidad de despliegue.

## Ejecución
Para levantar la base de datos y la aplicación con un solo comando:

```bash
docker compose up --build
```
La aplicación estará disponible en: [http://localhost:3000]

## Contexto
Se trata de un **Dashboard de Ventas y Gestión**: visualizando clientes VIP, ventas por categoría de producto, un ranking de productos más vendidos, órdenes y ranking de usuarios por gasto.

## A) Base de Datos
El sistema consta de 4 tablas (`usuarios`, `productos`, `categorias`, `ordenes`).
*   **Seed**: Datos de prueba generados al iniciar el contenedor para llenar los reportes.
*   **Seguridad**: La aplicación utiliza un rol (`reportes`) con permisos de solo lectura sobre las vistas, protegiendo así las tablas base.

## B) Vistas SQL
Se implementaron 5 vistas las cuales son las siguientes:

1.  **v_vip_clientes (Clientes VIP)**
    *   **Métricas**: `SUM`, `CASE` para estatus, `COALESCE` para valores nulos.
    *   **Uso**: Identificar usuarios con mayor gasto en compras (> $1000).

2.  **v_ventas_por_categoria (Ventas por Categoría)**
    *   **Métricas**: `COUNT`, `SUM`, `HAVING` para filtrar las categorías activas.
    *   **Uso**: Analizar los ingresos y el ticket promedio por categoría de productos.

3.  **v_productos_mas_vendidos**
    *   **Métricas**: `CTE`, `SUM`, `COALESCE`.
    *   **Uso**: Identificar los artículos más populares y la cantidad de órdenes.

4.  **v_resumen_ordenes_por_estado (Resumen de cantidades por estado)**
    *   **Métricas**: `SUM`, `COUNT`.
    *   **Uso**: Proporciona un resumen basado en el estado de las operaciones (completado vs pendiente).
    
5.  **v_ranking_usuarios_por_gasto (Posicionamiento Comercial)**
    *   **Métricas**: `RANK()`, `SUM`.
    *   **Uso**: Genera un ranking de los usuarios basado en sus gastos totales.


## C) Índices 
La creación de índices permite optimizar las consultas dentro de nuestras vistas.

### EXPLAIN ANALYZE
En esta ocasión, el volumen de datos de prueba es pequeño, por lo que nuestro Gestor de Bases de Datos puede optar por `Seq Scan` en lugar de `Index Scan`, sin embargo, la base de datos está adaptada para poder escalar.

**Consulta de Ventas por Categoría:**
```text
GroupAggregate (actual time=0.286..0.292 rows=2 loops=1)
  -> Sort (actual time=0.270..0.273 rows=3 loops=1)
     -> Nested Loop (actual time=0.133..0.141 rows=3 loops=1)
        -> Index Scan using categorias_pkey on categorias c
Execution Time: 0.953 ms
```

**Ranking de Usuarios:**
```text
WindowAgg (actual time=0.434..0.440 rows=3 loops=1)
  -> Sort (actual time=0.415..0.416 rows=3 loops=1)
     -> GroupAggregate (actual time=0.261..0.266 rows=3 loops=1)
Execution Time: 0.824 ms
```

## Evidencia del Comando: \dv
```text
                   List of relations
 Schema |             Name             | Type | Owner  
--------+------------------------------+------+--------
 public | v_productos_mas_vendidos     | view | Guzman
 public | v_ranking_usuarios_por_gasto | view | Guzman
 public | v_resumen_ordenes_por_estado | view | Guzman
 public | v_ventas_por_categoria       | view | Guzman
 public | v_vip_clientes               | view | Guzman
(5 rows)
```

## Trade-offs

*   **Cálculos en SQL**: Todos las operaciones (SUM, COUNT, RANK) se realizan directamente en la base de datos mediante las vistas.
*   **Paginación Server-Side**: Implementada con `LIMIT/OFFSET` directamente en nuestras queries SQL para evitar asi mandar información innecesaria al cliente.
*   **Validación con Zod**: Los parámetros de entrada se validan en el lado del servidor antes de ejecutar las queries, lo que garantiza que solo valores seguros lleguen a la base de datos.
*   **Singleton para Conexiones**: Se usa una única instancia del pool en las conexiones para evitar asi agotar el límite de conexiones de la base de datos.


## Seguridad

*   **Prevención de Inyección SQL**: Todas las queries utilizan parámetros  (`$1`, `$2`) en lugar de concatenación. haciendo asi que la entrada del usuario no afecte directamente a la base de datos.
*   **Privilegios**: La aplicación se conecta mediante el rol `reportes`, que tiene permisos unicamente de `SELECT` sobre las vistas. 
*   **Aislamiento de Credenciales**: Las contraseñas de conexión a la base de datos se configuran mediante variables de entorno (`.env`), las cuales no están incluidas en el repositorio.
*   **Validación de Entrada**: Todos los parámetros de usuario pasan por Zod que rechaza los valores fuera de rango o tipos erróneos antes de llegar a la base de datos.
*   **Salud de la Aplicación**: El servicio web solo inicia cuando la base de datos está completamente funcional, evitando asi errores de conexión.
