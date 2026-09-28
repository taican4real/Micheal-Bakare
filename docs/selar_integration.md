# Selar Payment Integration Architecture

## Overview
Selar is an e-commerce platform that handles its own checkout flows. Unlike traditional payment gateways (like Stripe or Paystack), Selar does not expose a public API for dynamically generating multi-item carts or custom-priced checkout sessions on the fly. 

To bridge the gap between our native Cart system and Selar's infrastructure, we use a **Webhook-Reconciliation Architecture** powered by Zapier (the officially supported Selar integration platform).

## The Flow
1. **Product & Cart**: Users add products to their local cart.
2. **Checkout**: The user enters their name and email, and an `Order` is created in our Firestore database with a `PENDING` status.
3. **Selar Payment**: The user is presented with the Selar payment link(s) for the products they are purchasing. 
4. **Zapier Webhook**: When a successful payment occurs on Selar, Selar triggers Zapier ("New Sale").
5. **Verification**: Zapier sends a secure `POST` request to our `/api/selar/webhook` endpoint.
6. **Order Reconciliation**: Our server validates the secret, finds the pending order by customer email, validates the amount, and marks the order as `PAID`.
7. **Digital Access**: Once the order is `PAID`, digital access is granted.

## Server-Side Security & Verification
- **No Client-Side Approvals**: Orders are never marked as paid via client-side redirects.
- **Webhook Authentication**: The webhook endpoint requires an `x-webhook-secret` header. This must match the `SELAR_WEBHOOK_SECRET` environment variable.
- **Idempotency & Duplicate Protection**: Every webhook payload must include a unique transaction reference from Selar. We log this in a `transactions` collection. If the same reference is received twice, the system ignores the duplicate but returns a 200 OK.
- **Order Reconciliation**: The system matches the incoming webhook's email address and amount against `PENDING` orders to find the correct order to fulfill.

## Setup Instructions for Admin
1. Create a Zap in Zapier.
2. **Trigger**: Select **Selar** -> **New Sale**.
3. **Action**: Select **Webhooks by Zapier** -> **Custom Request** (POST).
4. **URL**: `https://<YOUR_APP_URL>/api/selar/webhook`
5. **Headers**: Add `x-webhook-secret` and set it to your server's secret token.
6. **Payload (JSON)**:
   ```json
   {
     "email": "{{Customer Email}}",
     "amount": "{{Sale Amount}}",
     "currency": "{{Currency}}",
     "product_name": "{{Product Name}}",
     "reference": "{{Transaction Reference}}",
     "status": "success"
   }
   ```
