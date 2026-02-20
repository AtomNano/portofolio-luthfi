import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { CreditCard, ArrowUpRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Superadmin', href: '/admin/dashboard' },
    { title: 'Transactions Ledger', href: '/admin/transactions' },
];

export default function AdminTransactions({ transactions }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Ledger" />
            
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-8 lg:p-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <CreditCard className="h-8 w-8 text-cyan-500" />
                            Revenue Ledger
                        </h1>
                        <p className="text-gray-400 mt-1">Realtime sync with international payment gateways</p>
                    </div>
                </div>

                <Card className="bg-black/40 border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-white/5 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Tenant</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Gateway Ref</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {transactions?.data?.length > 0 ? (
                                    transactions.data.map((tx: any) => (
                                        <tr key={tx.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{tx.tenant_name}</div>
                                                <div className="text-xs text-cyan-400 mt-1">{tx.plan_slug.toUpperCase()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-green-400 flex items-center gap-1">
                                                    {tx.amount} <span className="text-xs font-normal text-gray-500">{tx.currency}</span>
                                                    <ArrowUpRight className="h-3 w-3" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300">
                                                    {tx.gateway_reference}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {tx.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-400 whitespace-nowrap">
                                                {tx.date}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <CreditCard className="mx-auto h-8 w-8 mb-3 opacity-50" />
                                            No transactions found yet. Waiting for webhook payloads.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
