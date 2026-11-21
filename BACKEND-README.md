# Mzansi Cart API foundation

This is a free-tier development service foundation.

## Endpoint
- `GET /health` — confirms the service is running.

## Intentionally disabled
- `/api/orders` returns HTTP 503. No customer orders are accepted or stored.

## Important
This service has no database, authentication, vendor portal, payment processing, payment webhooks, or delivery integration. Do not send real customer details to it. Keep mobile checkout and order submission disabled until those safeguards are implemented and tested.

The API is intended for development health checks only. Free-tier hosting may sleep when idle and is not a production availability guarantee.
