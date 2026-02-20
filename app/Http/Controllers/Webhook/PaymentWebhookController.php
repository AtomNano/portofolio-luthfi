<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    /**
     * Handle incoming webhooks from international gateways (Stripe, LemonSqueezy, Paddle).
     */
    public function handle(Request $request)
    {
        // 1. Verify Signature (Gateway specific logic goes here)
        // $signature = $request->header('X-Signature');

        $payload = $request->all();
        Log::info('Webhook received', ['payload' => $payload]);

        // 2. Identify Event Type
        $eventName = $payload['meta']['event_name'] ?? $payload['type'] ?? 'unknown';

        try {
            if (in_array($eventName, ['subscription_created', 'subscription_updated', 'payment_success'])) {
                $this->handleSubscriptionChange($payload);
            }
        } catch (\Exception $e) {
            Log::error('Webhook processing failed: '.$e->getMessage());

            return response()->json(['error' => 'Processing failed'], 500);
        }

        return response()->json(['status' => 'success']);
    }

    private function handleSubscriptionChange(array $payload)
    {
        // Extract tenant reference (usually passed as custom_data/metadata during checkout checkout)
        // This is a generic abstraction for SaaS boilerplates.

        $tenantId = $payload['meta']['custom_data']['tenant_id'] ?? $payload['data']['metadata']['tenant_id'] ?? null;
        $amount = $payload['data']['attributes']['total'] ?? $payload['data']['object']['amount_paid'] ?? 0;
        $currency = $payload['data']['attributes']['currency'] ?? $payload['data']['object']['currency'] ?? 'USD';
        $gatewayRef = $payload['data']['id'] ?? uniqid('tx_');
        $planSlug = $payload['data']['attributes']['custom_data']['plan_slug'] ?? 'pro'; // Assuming 'pro' for generic upgrades

        if (! $tenantId) {
            throw new \Exception('Missing tenant_id in webhook payload metadata.');
        }

        // Record the transaction
        Transaction::updateOrCreate(
            ['gateway_reference' => $gatewayRef],
            [
                'tenant_id' => $tenantId,
                'amount' => $amount / 100, // Assuming cents to decimal conversion
                'currency' => strtoupper($currency),
                'status' => 'completed',
                'plan_slug' => $planSlug,
                'is_renewal' => false,
            ]
        );

        // Auto-upgrade Tenant
        $tenant = Tenant::find($tenantId);
        $plan = Plan::where('slug', $planSlug)->first();

        if ($tenant && $plan) {
            $tenant->update([
                'plan_id' => $plan->id,
                'subscription_status' => 'active',
            ]);
        }
    }
}
