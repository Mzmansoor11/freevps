# Mzansi Cart — South African Marketplace

Mzansi Cart is a marketplace app prototype for discovering local vendors, shopping selected categories, and arranging delivery. The first launch market is planned for Johannesburg, with a staged expansion across South Africa.

## Brand
- **Name:** Mzansi Cart
- **Tagline:** Shop local. Get it delivered.
- **Primary:** Deep green (#174B35)
- **Secondary:** Leaf green (#246B4A)
- **Accent:** Warm gold (#E3A62F)

## Launch sequence
1. Start with groceries and household essentials from approved local vendors.
2. Add restaurants and takeaways after the first vendor/order workflow is proven.
3. Expand into electronics, fashion and general merchandise.
4. Add pharmacy listings only with appropriately licensed partners and regulatory checks.

## Current prototype
The React Native source includes customer browsing, cart state, sample vendor data, order/profile/location screens and navigation. Some screens still contain sample/demo data or placeholder UI. No live vendor network, production account authentication, payment processing, fulfilment service or live tracking is connected.

## App structure
- `Ubazol/`: Expo app project, app configuration, assets and package dependencies.
- `App.js` and `src/`: shared marketplace application screens, contexts and theme.
- `Ubazol/metro.config.js`: allows Expo Metro to watch the shared source folder one level above the Expo project.

## Run on Android
1. Install Node.js and npm on a development computer.
2. Open a terminal in the `Ubazol` folder.
3. Run `npm install`.
4. Run `npx expo start` and open the project in Expo Go or an Android emulator.

The app has not yet been executed in an Android runtime in this workflow. Validate the Metro configuration, Expo SDK dependencies, asset loading and navigation before distribution.

## Before public launch
- Implement secure server-side authentication; current local login helpers are demo-only.
- Build vendor applications, vendor approval and inventory/order management.
- Add a secure backend/database and role-based access controls.
- Integrate a South African payment provider with signed server-side payment confirmation/webhooks.
- Implement order acceptance, fulfilment, delivery status, refunds and customer support.
- Replace sample vendor listings, placeholder imagery and app artwork with approved real content.
- Add privacy, POPIA, consumer-protection and operational policies.
- Test the full customer/vendor/driver workflow before accepting payments.

## Revenue model to validate
- Commission on completed vendor orders.
- Clearly disclosed delivery/coordination fees.
- Optional paid featured listings.
- Vendor subscriptions once the marketplace has active customers.

Revenue, vendor participation and delivery coverage are not guaranteed by this prototype.
