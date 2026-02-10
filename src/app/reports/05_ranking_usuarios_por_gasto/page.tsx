import { pool } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PageSchema = z.object({
    page: z.coerce.number().min(1).default(1),
});

export default async function ReporteRankingUsuarios({
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
    SELECT * FROM v_ranking_usuarios_por_gasto 
    ORDER BY total_gastado DESC 
    LIMIT $1 OFFSET $2
  `;

    const countQuery = `SELECT COUNT(*) as total FROM v_ranking_usuarios_por_gasto`;

    const client = await pool.connect();
    const res = await client.query(query, [pageSize, offset]);
    const countRes = await client.query(countQuery);
    const users = res.rows;
    const totalUsers = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalUsers / pageSize);
    client.release();

    return (
        <main className="min-h-screen bg-neutral-950 text-gray-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="mb-10 border-b border-neutral-800 pb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Ranking de Usuarios</h1>
                        <p className="text-gray-500 text-sm">Listado de usuarios ordenados por cantidad de gasto total.</p>
                    </div>
                    <Link href="/" className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm transition-colors hover:bg-neutral-800">
                        ← Volver
                    </Link>
                </header>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold w-16 text-center">Pos</th>
                                <th className="px-6 py-4 font-semibold">Nombre de Usuario</th>
                                <th className="px-6 py-4 font-semibold text-right">Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {users.map((user: any, idx: number) => {
                                const globalRank = offset + idx + 1;
                                return (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 text-xs text-gray-600 font-mono text-center">#{globalRank}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{user.nombre_usuario}</td>
                                        <td className="px-6 py-4 text-sm text-right text-white font-bold font-mono">
                                            ${Number(user.total_gastado).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="p-6 bg-black/10 border-t border-neutral-800 flex justify-between items-center">
                        <div className="flex gap-2">
                            {currentPage > 1 ? (
                                <Link
                                    href={`/reports/05_ranking_usuarios_por_gasto?page=${currentPage - 1}`}
                                    className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-bold text-gray-400 hover:bg-neutral-800 transition-colors"
                                >
                                    Anterior
                                </Link>
                            ) : (
                                <div className="px-4 py-2 opacity-0 text-xs shadow-none cursor-default">Anterior</div>
                            )}

                            {currentPage < totalPages ? (
                                <Link
                                    href={`/reports/05_ranking_usuarios_por_gasto?page=${currentPage + 1}`}
                                    className="px-4 py-2 border border-neutral-800 rounded-lg text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                                >
                                    Siguiente
                                </Link>
                            ) : (
                                <div className="px-4 py-2 opacity-0 text-xs shadow-none cursor-default">Siguiente</div>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                            Página {currentPage} de {totalPages} • Total: {totalUsers}
                        </span>
                    </div>
                </div>

                <div className="mt-10 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg text-center">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
                        Vista: v_ranking_usuarios_por_gasto
                    </p>
                </div>
            </div>
        </main>
    );
}