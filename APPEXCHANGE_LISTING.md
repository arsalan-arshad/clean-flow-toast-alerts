# AppExchange Listing Dossier: Clean Flow Toast & Alerts

This document contains the complete listing metadata, marketing copy, technical disclosures, and Security Review readiness package to list **Clean Flow Toast & Alerts** on the Salesforce AppExchange.

---

## 1. Listing Metadata

| Field | Value | Constraints |
| :--- | :--- | :--- |
| **App Title** | `Clean Flow Toast & Alerts` | Max 80 chars |
| **Short Tagline** | `Modern Toasts, Reactive Alert Banners, Confetti Celebrations & Utility Bar Alerts for Flows.` | 94 / 100 chars |
| **Listing Type** | App (Second-Generation Managed Package - 2GP) | Standard AppExchange |
| **Pricing Model** | **Free / 100% Open-Source** (MIT License) | Free |
| **Primary Category** | **Automation & Workflow** | AppExchange Primary |
| **Secondary Categories** | **Admin Tools**, **Developer Tools**, **Productivity** | AppExchange Secondary |
| **Target Audience** | Salesforce Administrators, Flow Architects, Developers, Consultants | All Orgs |
| **Supported Editions** | Essentials, Professional, Enterprise, Unlimited, Developer | All editions with Flow Builder |
| **Package Version ID** | `04tg7000000WDVBAA4` (`v0.1.0.1`) | Released 2GP Package |
| **Source Repository** | [github.com/arsalan-arshad/clean-flow-toast-alerts](https://github.com/arsalan-arshad/clean-flow-toast-alerts) | Public MIT |

---

## 2. Marketing & Listing Copy

### 2.1 Short Description (Tile Card View - 250 characters)
> Supercharge your Salesforce Flows with modern toasts, SLDS reactive alert banners, celebratory canvas confetti, and utility bar notifications. 100% native, zero-dependency, and Agentforce AI ready.

### 2.2 Full Description
```markdown
Give your Salesforce users the modern, delightful experience they deserve—without writing a single line of code!

Salesforce Admins build hundreds of thousands of Screen Flows and Autolaunched Flows every day. However, native Flow feedback has historically been clunky and restricted:
- No native way to trigger standard Salesforce toast notifications from Flows.
- Static, uninspired error and warning messages with zero reactivity.
- Significant milestones (Closed-Won Opportunities, Completed Onboarding) pass without user celebration.
- Headless Flows and Agentforce AI Agents cannot push real-time UI alerts to human users in active sessions.

Clean Flow Toast & Alerts solves all of this with an enterprise-grade, lightweight, and 100% native suite of Lightning Web Components and Flow Actions.

### 🌟 Key Capabilities

1. ⚡ Dual-Engine Toast Notifications:
   - Screen Flow Launcher: Fire dismissible, pester, or sticky toasts instantly upon screen load with automatic Flow step advancement and 1-click record navigation.
   - Headless Invocable Action: Fire toasts from Autolaunched Flows, Record-Triggered Flows, and Agentforce AI Agents via high-throughput Platform Events.

2. 📢 SLDS Reactive Alert Banners:
   - Embed beautiful, SLDS-compliant inline alert notices directly inside Flow screens.
   - Reactive Flow Outputs: Expose `isDismissed` and `dismissCount` in real time to dynamically branch downstream Flow logic and conditional field visibility.
   - Built-in Auto-Dismiss Countdown: Automatically hide notices after N seconds with an animated countdown bar.

3. 🎉 Zero-Dependency Celebration Particle Engine:
   - Reward users upon completing key workflows with 4 distinct celebration animations: Confetti burst, Twin Cannons, Celebration Rain, and Fireworks.
   - Rendered using pure HTML5 Canvas (zero external 3rd-party scripts or CDN risks).

4. 🎵 Web Audio API Sound Synthesizer:
   - Provide audible feedback for success, warning, error, and celebration events.
   - Synthesizes chords directly in the browser using the native Web Audio API (zero static MP3 files, zero CSP violations).

5. 🔔 Utility Bar Platform Event Listener & Toast Feed:
   - A dedicated Utility Bar component that subscribes to Platform Events across the org.
   - Target specific users or broadcast org-wide.
   - Slide-out notification history drawer to review recent alerts.

### 🔒 Enterprise-Grade & 100% Safe:
- 100% Native Salesforce architecture (No external servers, no third-party APIs).
- Strict `with sharing` enforcement and Field-Level Security compliance.
- 93% Apex test coverage across positive, negative, and bulk scenarios.
- 100% Lightning Web Security (LWS) compliant.
```

### 2.3 Feature Bullet Points (AppExchange Highlights Tab)
- **1-Click Screen Flow Toasts:** Trigger standard success, error, warning, or info toasts with custom titles, messages, and record navigation.
- **Auto-Advance Flow Transitions:** Seamlessly trigger a toast and advance to the next Flow screen without user interaction.
- **Reactive Alert Banners:** SLDS banners that expose reactive Boolean outputs (`isDismissed`) to drive dynamic Flow screen reactivity.
- **Zero-Dependency Confetti:** Built-in HTML5 Canvas particle engine supporting Confetti, Cannons, Rain, and Fireworks.
- **Dynamic Web Audio Chimes:** Pure browser-synthesized audio tones for feedback with zero static MP3 files or CSP warnings.
- **Agentforce & Headless Flow Action:** Invocable Action (`Show Toast or Alert`) triggers real-time alerts via Platform Events.
- **Utility Bar Toast Listener & Feed:** Real-time empApi subscriber with slide-out drawer history for past notifications.
- **100% Native & Free:** Fully open-source under the MIT License with zero recurring subscription fees.

---

## 3. Visual Assets Matrix

All visual assets have been crafted to exact Salesforce AppExchange specifications:

| Asset | File Name | Dimensions / Aspect Ratio | Purpose |
| :--- | :--- | :--- | :--- |
| **App Icon (Square)** | `assets/app_icon_120.png` | 120 x 120 px (PNG) | AppExchange tile icon & App Launcher |
| **App Banner (Hero)** | `assets/app_banner.jpg` | 16:9 ratio (1280 x 720 px) | Listing header banner & README |
| **Screenshot 1** | `assets/screenshot_1_screen_flow_toast.png` | 16:9 ratio (1280 x 720 px) | Screen Flow Toast launcher configuration & UI |
| **Screenshot 2** | `assets/screenshot_2_alert_banners.png` | 16:9 ratio (1280 x 720 px) | SLDS Reactive Alert Banners with countdown |
| **Screenshot 3** | `assets/screenshot_3_confetti_celebration.png` | 16:9 ratio (1280 x 720 px) | Canvas Confetti Celebration particle engine |
| **Screenshot 4** | `assets/screenshot_4_agentforce_listener.png` | 16:9 ratio (1280 x 720 px) | Utility Bar empApi listener & Agentforce feed |

---

## 4. AppExchange Security Review & Technical Assessment

### 4.1 Architecture & Security Attributes
- **External Endpoints & Callouts:** **None (0)**. The application makes zero HTTP callouts to external servers or web services.
- **Third-Party JavaScript Libraries:** **None (0)**. The Canvas particle engine and Web Audio API synthesizer are written in 100% native, vanilla JavaScript.
- **Lightning Web Security (LWS) Compatibility:** Fully compliant with Lightning Web Security and Locker Service.
- **Content Security Policy (CSP):** Zero CSP modifications required. Does not load external fonts, styles, scripts, or media files.
- **Data Storage & Privacy:** The application does **not** store, log, or transmit any Personally Identifiable Information (PII) or customer data. Platform Events are transient and adhere to standard Salesforce event retention rules.
- **Sharing Model:** All Apex classes strictly enforce `with sharing`.
- **Field-Level Security (FLS) & CRUD:** Service layer sanitizes user inputs, trims strings, and validates ID formats.

### 4.2 Security Review Questionnaire Answers

| Question | Official Response |
| :--- | :--- |
| **Does the package make outbound callouts to any external services?** | **No.** 100% of execution occurs natively inside the Salesforce Lightning runtime and Apex engine. |
| **Does the package store sensitive user data or credentials?** | **No.** No credentials, tokens, or PII are stored or processed. |
| **Are third-party scripts loaded via static resources or CDN?** | **No.** All animations and audio are rendered using native browser APIs (`HTML5 Canvas`, `Web Audio API`). |
| **Does the package contain Apex code?** | **Yes.** 3 Apex classes (`FlowToastService`, `FlowToastAction`, `FlowToastController`). |
| **What is the Apex code coverage?** | **93.00%** overall across all classes with 19 comprehensive unit tests covering bulk, positive, and negative paths. |
| **Does the package utilize Platform Events?** | **Yes.** A single high-volume platform event `Clean_Flow_Toast_Event__e` is used for asynchronous toast notifications. |
| **Does the package respect User Permissions?** | **Yes.** A dedicated Permission Set (`Clean_Flow_Toast_User`) is included to grant granular access to Apex and Platform Events. |

---

## 5. Direct Package Installation Links

| Target Environment | Direct 1-Click Link |
| :--- | :--- |
| **Production / Developer Edition** | [👉 Install in Production / Dev Org (04tg7000000WDVBAA4)](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tg7000000WDVBAA4) |
| **Sandbox Environment** | [👉 Install in Sandbox (04tg7000000WDVBAA4)](https://test.salesforce.com/packaging/installPackage.apexp?p0=04tg7000000WDVBAA4) |
| **Salesforce CLI** | `sf package install --package 04tg7000000WDVBAA4 --wait 20 --target-org <YOUR_ORG_ALIAS>` |
