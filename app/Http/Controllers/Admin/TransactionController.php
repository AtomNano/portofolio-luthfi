<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('tenant')
            ->latest()
            ->paginate(15)
            ->through(fn ($tx) => [
                'id' => $tx->id,
                'tenant_name' => $tx->tenant ? $tx->tenant->name : 'Unknown',
                'gateway_reference' => $tx->gateway_reference,
                'amount' => '$'.number_format($tx->amount, 2),
                'currency' => $tx->currency,
                'status' => $tx->status,
                'plan_slug' => $tx->plan_slug,
                'date' => $tx->created_at->format('M d, Y H:i'),
            ]);

        return Inertia::render('admin/transactions', [
            'transactions' => $transactions,
        ]);
    }
}
