import Link from 'next/link';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReporteEstadoOrdenes() {
    const query = `SELECT * FROM v_resumen_ordenes_por_estado`;

    const clienteDb = await pool.connect();
    const res = await clienteDb.query(query);
    const filas = res.rows;
    clienteDb.release();

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 border-b border-neutral-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Estado de Órdenes</h1>
                        <p className="text-gray-500 text-sm">Estado de las transacciones.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm transition-colors hover:bg-neutral-800">
                        ← Volver
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filas.map((fila: any, idx: number) => (
                        <div key={idx} className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-lg">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="font-bold text-xl text-white capitalize mb-1">{fila.estado_orden}</h2>
                                </div>
                                <span className="bg-neutral-800 text-gray-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase border border-neutral-700">
                                    {fila.total_ordenes} Órdenes
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-4xl font-bold text-white mb-1">
                                    ${Number(fila.ingresos_totales).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest">Monto total acumulado</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg text-center">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                        Fuente de datos: v_resumen_ordenes_por_estado
                    </p>
                </div>
            </div>
        </main>
    );
}