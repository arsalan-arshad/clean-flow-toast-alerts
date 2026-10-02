# Contributing to Clean Flow Toast & Alerts

Thank you for helping make Salesforce Flows look and feel better!

## Local Development Workflow
1. Authorize your Dev Hub:
   ```bash
   sf org login web -d -a my-dev-hub
   ```
2. Create a scratch org:
   ```bash
   sf org create scratch -f config/project-scratch-def.json -a toast-dev -d 7
   ```
3. Deploy components:
   ```bash
   sf project deploy start
   ```
4. Run tests:
   ```bash
   sf apex run test -c -r human
   npm run test:unit
   ```

## PR Guidelines
- Ensure Flow Invocable Actions have clear descriptions and input/output labels in Flow Builder.
- LWC screen components must render responsively across desktop and mobile.
