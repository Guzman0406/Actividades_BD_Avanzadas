# Repositorio de Triggers para Base de Datos Avanzada

Este repositorio contiene la implementación de una base de datos PostgreSQL con lógica de negocio integrada mediante triggers.

## Contenido

1.  [01_schema.sql]: Estructura de tablas (Usuarios, Productos, Ordenes, Auditoría).
2.  [02_triggers.sql]: Lógica de validación, auditoría automática, actualización de fechas y borrado lógico.
3.  [03_seed.sql]: Datos de prueba iniciales.
4.  [04_tests.sql]: Queries de verificación para los triggers.

## Instrucciones de Despliegue

Para levantar el entorno con Docker:

```bash
docker-compose up -d
```

Los archivos SQL se ejecutarán automáticamente en orden numérico al iniciar el contenedor.
