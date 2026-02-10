import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PageSchema = z.object({
    page: z.coerce.number().min(1).default(1),
});

export default async function ReporteProductosVenta({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const parsed = PageSchema.safeParse(params);
    const currentPage = parsed.success ? parsed.data.page : 1;
    const pageSize = 8; 
    const offset = (currentPage - 1) * pageSize;

    const query = `
    SELECT * FROM v_productos_mas_vendidos 
    ORDER BY veces_vendido DESC
    LIMIT $1 OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) as total FROM v_productos_mas_vendidos`;

    const client = await pool.connect();
    const res = await client.query(query, [pageSize, offset]);
    const countRes = await client.query(countQuery);
    const products = res.rows;
    const totalProducts = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalProducts / pageSize);
    client.release();

    const topProduct = products.length > 0 && currentPage === 1 ? products[0] : null;


    return (
        <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 border-b border-neutral-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Top Productos</h1>
                        <p className="text-gray-500 text-sm">Los artículos con mayor volumen de ventas (Paginado).</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm transition-colors hover:bg-neutral-800">
                        ← Volver
                    </Link>
                </header>

                {topProduct && (
                    <div 
                    className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl mb-10 shadow-lg">
                        <h2 className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">Líder de Ventas</h2>
                        <p className="text-4xl font-bold text-white mb-6 truncate">{topProduct.nombre_producto}</p>
                        <div className="flex gap-12">
                        </div>

                    </div>
                )}

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold w-16 text-center">Pos</th>
                                <th className="px-6 py-4 font-semibold">Nombre del Producto</th>
                                <th className="px-6 py-4 font-semibold text-right">Órdenes</th>
                                <th className="px-6 py-4 font-semibold text-right">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {products.map((p: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 text-xs text-gray-600 font-mono text-center">#{offset + idx + 1}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{p.nombre_producto}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-400">{p.veces_vendido}</td>
                                    <td className="px-6 py-4 text-sm text-right text-white font-bold font-mono">{p.total_cantidad_vendida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-6 bg-black/10 border-t border-neutral-800 flex justify-between items-center">
                        <div className="flex gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={`/reports/03_productos_mas_vendidos?page=${currentPage - 1}`}
                                    className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-bold text-gray-400 hover:bg-neutral-800 transition-colors"
                                >
                                    Anterior
                                </Link>
                            ) : (
                                <div className="px-4 py-2 opacity-0 text-xs shadow-none cursor-default">Anterior</div>
                            )}

                            {currentPage < totalPages ? (
                                <Link
                                    href={`/reports/03_productos_mas_vendidos?page=${currentPage + 1}`}
                                    className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                                >
                                    Siguiente
                                </Link>
                            ) : (
                                <div className="px-4 py-2 opacity-0 text-xs shadow-none cursor-default">Siguiente</div>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                            Página {currentPage} de {totalPages} • Total: {totalProducts}
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
