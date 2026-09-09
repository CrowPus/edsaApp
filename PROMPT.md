Build a production-quality EDSA digital customer platform prototype for the Electricity Distribution and Supply Authority of Sierra Leone.

This project must support Web, Android, and iOS from the beginning. Do not build three unrelated products. Use a shared design system, shared business logic where practical, and a consistent user experience across all platforms.

The product is a prototype only. Do not connect to real EDSA infrastructure, real payment systems, real meter vending systems, or real customer data. Use realistic hardcoded/demo data and clearly structure the code so real APIs can be connected later.

The customer experience must be simple and minimal. Avoid unnecessary onboarding and too many pages. The core flow is:

Login → Home → Buy Electricity → Confirm Payment → Success/Token → Transactions

The app should include:

Login with phone number and password
Home dashboard with saved meter, estimated balance, Buy Electricity, quick access to meters, transactions, outage reporting, and support
Buy Electricity screen with meter selection, amount selection, and payment method
Payment confirmation screen
Success screen showing generated demo electricity token, amount, units, meter number, copy/share actions, and receipt
Transaction history with previous purchases and reusable old tokens
Multiple meter support
Report outage
Customer support

Payment methods shown in the prototype:

Orange Money
Afrimoney
Visa / Mastercard

Do not generate real STS tokens. Simulate token generation only.

Platform requirements

Mobile

Build for both iOS and Android. Prefer React Native with Expo unless there is a strong technical reason not to. The layout must feel native, fast, accessible, responsive, and suitable for low-to-mid-range Android devices commonly used in Sierra Leone.

Web

Build a responsive web application using the same branding and product logic. The web version must not look like a stretched mobile app. On desktop, make better use of horizontal space while keeping the same core customer workflow.

Architecture

Structure the project so that shared functionality can later connect to:

Authentication API
Customer account API
Meter management API
Payment gateway
Mobile money providers
Bank/card payment providers
EDSA vending/token system
Notification service
Outage reporting system

For now, create clean service interfaces and mock implementations instead of real integrations.

Example future flow:

Client App → EDSA API → Payment Service → Authorized Vending System → STS Token → Customer

The frontend must never generate real electricity tokens itself.

Design direction

Use the supplied official EDSA logo and the UI references provided.

The visual style should feel like:

trusted national infrastructure + modern digital utility

Use:

White/light backgrounds
Strong EDSA navy/blue
Red only as a brand/accent or warning color
Clean typography
Rounded cards
Clear spacing
Large touch targets
Strong contrast
Simple icons
Minimal decorative imagery

Do not make it look like crypto, a generic fintech app, or an AI-generated dashboard.

Decorative photography should mainly be used where it adds meaning, such as the login screen. Functional screens should prioritize information and actions.

UX principles

The user should be able to buy electricity in very few steps.

Avoid creating a separate screen when a modal, bottom sheet, expandable section, or inline interaction would work better.

Optimize for:

Older users
First-time smartphone users
Low-bandwidth environments
Small Android screens
Clear error states
Slow network conditions
Failed payment simulation
Easy recovery

Add loading, empty, success, and error states to the prototype.

Demo data

Use realistic Sierra Leone demo values, for example:

Meter: 12345678901
Location: Freetown
Balance: 46.8 kWh
Purchase: Le 500
Units: 42.7 kWh

Use fake phone numbers and clearly fictional transaction data.

Code quality

Build this as if it may later become a real government utility application.

Requirements:

Modular architecture
Reusable components
Shared design tokens
Strict typing
Accessible UI
Responsive layouts
Proper error boundaries
Form validation
Clean state management
No secrets in frontend code
No hardcoded production credentials
Clear separation between mock services and future real services
Production-quality naming and folder structure

Create a README explaining:

Architecture
How to run Web
How to run Android
How to run iOS
Where mock data lives
Where future APIs should be connected
Important

This is for a board-level prototype. It must look complete and credible, but it must remain technically safe.

Do not invent real EDSA backend capabilities.

Do not claim real-time meter balance unless marked as simulated.

Do not connect to any live payment provider.

Do not overbuild the MVP.

The final result should make the board immediately understand:

“EDSA customers can manage their electricity digitally from one official platform, whether they use the web, Android, or iPhone.”