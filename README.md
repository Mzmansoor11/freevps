# Mzansi Cart — South African Marketplace

Mzansi Cart is a marketplace concept for discovering local vendors, shopping across selected categories, placing orders and arranging delivery. The initial launch focus is Johannesburg, with a staged expansion plan for South Africa.

## Brand direction
- **Name:** Mzansi Cart
- **Positioning:** Shop local. Get it delivered.
- **Primary colour:** Deep South African green (#174B35)
- **Secondary colour:** Leaf green (#246B4A)
- **Accent:** Warm gold (#E3A62F)

## Initial launch plan
1. Start with groceries and household essentials from existing local vendors.
2. Add restaurants and takeaways after the first vendor/order workflow is proven.
3. Expand into electronics, fashion and general merchandise.
4. Add pharmacy listings only after appropriate licensed partners and regulatory checks are in place.

## Current prototype capabilities
The source includes React Native screens and context modules for customer browsing, vendors, cart, orders, profiles, location and notifications. Some screens use sample/demo data and local state. These are prototype components, not proof of a production-ready ordering service.

## Important gaps before public launch
- Integrate and test the main application entry point with the Expo project.
- Implement secure user authentication and a production backend/database.
- Build vendor onboarding, product/inventory management and order acceptance.
- Implement payment processing and verified payment webhooks.
- Connect delivery partners/drivers and live order status.
- Add privacy, security, consumer-protection and operational policies.
- Replace placeholder artwork with approved Mzansi Cart logo and app icons.
- Test end-to-end ordering, cancellations, refunds and delivery.

## Project layout
- `App.js` and `src/`: marketplace application screens, contexts and theme.
- `Ubazol/`: existing Expo starter project and package configuration. Its current `App.js` is still the Expo starter placeholder and needs to be connected to the marketplace application before running the complete app from that folder.

## Development
The repository is being rebranded on the `groot/ubazol-rebuild` branch. The production/default `main` branch is intentionally left unchanged until the changes are reviewed and tested.

## Revenue model to validate
- Commission on completed vendor orders.
- Clearly disclosed delivery/coordination fees where applicable.
- Optional paid featured listings for vendors.
- Optional vendor subscription tools once the service has active customers.

No revenue, vendor participation, payment integration or delivery coverage is guaranteed by this prototype.
