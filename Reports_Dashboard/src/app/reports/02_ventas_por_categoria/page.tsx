import Link from 'next/link';
import { pool } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const FilterSchema = z.object({
    min: z.coerce.number().min(0).default(0),
});

export default async function ReporteVentasCategoria({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const parsed = FilterSchema.safeParse(params);
    const minRevenue = parsed.success ? parsed.data.min : 0;

    const query = `
    SELECT * FROM v_ventas_por_categoria 
    WHERE ganancias >= $1
    ORDER BY ganancias DESC
  `;

    const client = await pool.connect();
    const res = await client.query(query, [minRevenue]);
    const categories = res.rows;
    client.release();

    const totalRevenue = categories.reduce((acc: any, curr: any) => acc + Number(curr.ganancias), 0);
    const topCategory = categories[0]?.nombre_categoria || 'N/A';

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 border-b border-neutral-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Ventas por Categoría</h1>
                        <p className="text-gray-500 text-sm">Ingresos generados por categoria de productos.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm transition-colors hover:bg-neutral-800">
                        ← Volver
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                        <h3 className="text-xs text-gray-500 uppercase font-bold mb-2">Categoría Top</h3>
                        <p className="text-3xl font-bold text-white">{topCategory}</p>
                    </div>

                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold">Categoría</th>
                                <th className="px-6 py-4 font-semibold text-right">Órdenes</th>
                                <th className="px-6 py-4 font-semibold text-right">Ticket Prom.</th>
                                <th className="px-6 py-4 font-semibold text-right">Ganancias</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {categories.map((cat: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{cat.nombre_categoria}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-400">{cat.total_ordenes}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-400 font-mono">
                                        ${Number(cat.ticket_promedio).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-white font-bold font-mono">
                                        ${Number(cat.ganancias).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 bg-black/10 border-t border-neutral-800 text-[10px] text-gray-600 text-right">
                        ORIGEN: V_VENTAS_POR_CATEGORIA
                    </div>
                </div>
            </div>
        </main>
    );
}