import Link from 'next/link';
import { pool } from '@/lib/db';

// dynamic para tener los datos actualizados cada vez que entramos
export const dynamic = 'force-dynamic';

export default async function PaginaPrincipal() {

  const clienteDb = await pool.connect();

  // Saber cuánto suman las órdenes completadas.
  const resultadoIngresos = await clienteDb.query(`
    SELECT COALESCE(SUM(Ingresos_totales), 0) as total 
    FROM v_resumen_ordenes_por_estado 
    WHERE Estado_orden = 'completado'
  `);
  // Convertimos el resultado a número. Si es nulo, usamos 0.
  const totalIngresos = Number(resultadoIngresos.rows[0]?.total || 0);  
  

  // Saber cuál es el producto que más veces aparece vendido.
  const resultadoProductoTop = await clienteDb.query(`
    SELECT nombre_producto, veces_vendido 
    FROM v_productos_mas_vendidos 
    ORDER BY veces_vendido DESC
    LIMIT 1
  `);
  const productoEstrella = resultadoProductoTop.rows[0] || { nombre_producto: 'Sin datos', veces_vendido: 0 };

  clienteDb.release();

  return (
    <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-10 border-b border-neutral-800 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Panel de Control</h1>
          <div className="flex justify-between items-end">
            <p className="text-gray-500">Dashboard para visualizar Views directas de una base de datos.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols gap-4 mb-10">

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-white">
              ${totalIngresos.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-2">Total procesado (Estado: Completado)</p>
          </div>
          
        </div>

        { /* CARDS PARA LAS VIEWS */}

        <h2 className="text-xl font-bold text-white mb-6">Explorar Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Link href="/reports/01_vip_clientes" className="group block p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">Clientes VIP</h3>
                <p className="text-sm text-gray-500 mt-1"> Clientes con compras superiores a $1,000</p>
              </div>
              <span className="text-2xl text-gray-700">→</span>
            </div>
          </Link>

          <Link href="/reports/02_ventas_por_categoria" className="group block p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">Ventas por Categoría</h3>
                <p className="text-sm text-gray-500 mt-1">Ingresos por tipo de producto</p>
              </div>
              <span className="text-2xl text-gray-700">→</span>
            </div>
          </Link>

          <Link href="/reports/03_productos_mas_vendidos" className="group block p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">Top Productos</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Más vendido: <span className="text-white font-bold">{productoEstrella.nombre_producto}</span>
                </p>
              </div>
              <span className="text-2xl text-gray-700">→</span>
            </div>
          </Link>

          <Link href="/reports/04_resumen_ordenes_por_estado" className="group block p-5 bg-neutral-900 border border-neutral-800 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">Estado de Órdenes</h3>
                <p className="text-sm text-gray-500 mt-1">Órdenes completadas vs pendientes.</p>
              </div>
              <span className="text-2xl text-gray-700">→</span>
            </div>
          </Link>

          <Link href="/reports/05_ranking_usuarios_por_gasto" className="group block p-5 bg-neutral-900 border border-neutral-800 rounded-xl md:col-span-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-white">Ranking de usuarios</h3>
                <p className="text-sm text-gray-500 mt-1">Tabla completa de posiciones de todos los usuarios.</p>
              </div>
              <span className="text-2xl text-gray-700">→</span>
            </div>
          </Link>

        </div>
      </div>
    </main>
    );
  }