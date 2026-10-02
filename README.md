# Clean Flow Toast & Alerts (Flow UI Supercharger)

> **Open-Source (MIT)** | Built for the Trailblazer & Salesforce Developer Community | Open for PRs & Discussions

## 1. Overview & Vision
Salesforce Admins build hundreds of thousands of Screen Flows and Autolaunched Flows every day. However, native Flow feedback is notoriously ugly and restrictive:
- Admins cannot easily fire standard Salesforce Toast notifications from Flows without writing custom code or installing bloated packages.
- Native Flow screens have boring banners, no customizable alerts, and no celebratory animations (like confetti).

**Clean Flow Toast & Alerts** gives Admins a lightweight, drag-and-drop open-source suite of Flow Actions and Screen Components to display modern toasts, inline callouts, modals, and celebration effects with zero code.

## 2. Core Features (MVP)
- **Flow Invocable Action (`ShowToastAction`):**
  - Works in both Screen Flows and Autolaunched / Record-Triggered Flows (via platform event or headless LWC).
  - Configurable parameters:
    - `Title` (String)
    - `Message` (String, supports Flow formulas/variables)
    - `Variant` (Success, Error, Warning, Info)
    - `Mode` (Dismissible, Pester, Sticky)
    - `Url / Record Link` (Direct link to the created or updated record)
- **Flow Screen Component (`ModernAlertBanner`):**
  - Rich SLDS alert banners directly inside Flow screens.
  - Custom icons, themeable colors (info blue, warning amber, error red, success green), and dismissible buttons.
- **Confetti Cannon Screen Action (`FlowCelebration`):**
  - Triggers a confetti burst on completion screens (e.g., when an Opportunity is closed won or an onboarding flow finishes).

## 3. Architecture & Tech Stack
- **Frontend:** Lightning Web Components (LWC) with `lightning/platformShowToastEvent` and canvas-confetti.
- **Backend:** Invocable Apex Action (`FlowToastController.cls`).
- **Metadata:** Flow Screen Component definition XML (`lightning__FlowScreen`).

## 4. AppExchange & Community Strategy
- **Audience:** Salesforce Admins, Consultants, and Flow architects.
- **Why It Spreads:** Admins share Flow components widely on LinkedIn, Reddit (`r/salesforce`), and Salesforce Trailblazer Community.
- **Zero Ongoing Cost:** 100% native client-side execution; requires zero backend servers or ongoing API calls.

## 5. Open-Source Roadmap & Good First Issues for PRs
- [ ] Sound effects / chimes toggle for celebration screens (accessibility-friendly).
- [ ] Custom countdown timer component for Flow screens.
- [ ] Modal dialog launcher invocable action.
- [ ] Community themes and color presets for banners.
