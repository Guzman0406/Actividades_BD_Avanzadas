import Link from 'next/link';
import { pool } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const FilterSchema = z.object({
    min: z.coerce.number().min(0).default(0),
});

export default async function ReporteVIPClientes({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const parsed = FilterSchema.safeParse(params);
    const minSpent = parsed.success ? parsed.data.min : 0;

    const query = `
    SELECT * FROM v_vip_clientes 
    WHERE total_gastado >= $1
    ORDER BY total_gastado DESC
  `;

    const client = await pool.connect();
    const res = await client.query(query, [minSpent]);
    const customers = res.rows;
    client.release();

    const totalSpent = customers.reduce((acc: number, curr: any) => acc + Number(curr.total_gastado), 0);
    const vipCount = customers.filter((c: any) => c.status === 'VIP').length;


    return (
        <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 border-b border-neutral-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Clientes VIP</h1>
                        <p className="text-gray-500 text-sm">Listado de usuarios con mayor volumen comercial.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm transition-colors hover:bg-neutral-800">
                        ← Volver
                    </Link>
                </header>

                {/* Zod */}
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl mb-8">
                    <form className="flex items-end gap-4">
                        <div className="flex-1 max-w-xs">
                            <label htmlFor="min" className="block text-[10px] text-gray-500 uppercase font-bold mb-2 ml-1 tracking-widest">
                                Gasto Mínimo ($)
                            </label>
                            <input
                                type="number"
                                id="min"
                                name="min"
                                defaultValue={minSpent}
                                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Aplicar Filtro
                        </button>
                        {minSpent > 0 && (
                            <Link href="/reports/01_vip_clientes" className="mb-2 text-gray-500 hover:text-white text-xs transition-colors">
                                Limpiar
                            </Link>
                        )}
                    </form>
                </div>

                <div

                 className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                        <h3 className="text-xs text-gray-500 uppercase font-bold mb-2">Total Gastado</h3>
                        <p className="text-3xl font-bold text-white">${totalSpent.toLocaleString()}</p>
                    </div>
                    
              
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold">Nombre del Cliente</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold text-right">Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {customers.map((customer: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{customer.nombre}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${customer.status === 'VIP' ? 'bg-white/10 text-white' : 'text-gray-500 border border-neutral-800'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-white font-bold font-mono">
                                        ${Number(customer.total_gastado).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic text-sm">
                                        No se encontraron registros con los criterios seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="p-4 bg-black/10 border-t border-neutral-800 text-[10px] text-gray-600 text-right">
                        VISTA: V_VIP_CLIENTES
                    </div>
                </div>
            </div>
        </main>
    );
}