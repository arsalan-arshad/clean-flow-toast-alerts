import { createElement } from 'lwc';
import CleanFlowAlertBanner from 'c/cleanFlowAlertBanner';

describe('c-clean-flow-alert-banner', () => {
    beforeAll(() => {
        window.open = jest.fn();
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('renders banner with title, message, and variant class', () => {
        const element = createElement('c-clean-flow-alert-banner', {
            is: CleanFlowAlertBanner
        });
        element.title = 'Warning: Action Required';
        element.message = 'Please check your inputs before continuing.';
        element.variant = 'warning';

        document.body.appendChild(element);

        const bannerDiv = element.shadowRoot.querySelector('.slds-notify_alert');
        expect(bannerDiv).not.toBeNull();
        expect(bannerDiv.classList.contains('alert-theme-warning')).toBe(true);

        const titleEl = element.shadowRoot.querySelector('.alert-title');
        expect(titleEl.textContent).toBe('Warning: Action Required');

        const messageEl = element.shadowRoot.querySelector('.alert-message');
        expect(messageEl.textContent).toBe('Please check your inputs before continuing.');
    });

    it('handles dismiss button click and updates Flow output variables', () => {
        const element = createElement('c-clean-flow-alert-banner', {
            is: CleanFlowAlertBanner
        });
        element.title = 'Dismissible Note';
        element.message = 'You can close this.';
        element.isDismissible = true;

        const dismissHandler = jest.fn();
        element.addEventListener('dismiss', dismissHandler);

        document.body.appendChild(element);

        const closeBtn = element.shadowRoot.querySelector('lightning-button-icon');
        expect(closeBtn).not.toBeNull();
        closeBtn.click();

        return Promise.resolve().then(() => {
            expect(element.isDismissed).toBe(true);
            expect(element.dismissCount).toBe(1);
            expect(dismissHandler).toHaveBeenCalledTimes(1);

            // Banner should be removed from DOM
            const bannerDiv = element.shadowRoot.querySelector('.slds-notify_alert');
            expect(bannerDiv).toBeNull();
        });
    });

    it('renders action button and dispatches actionclick event', () => {
        const element = createElement('c-clean-flow-alert-banner', {
            is: CleanFlowAlertBanner
        });
        element.message = 'System maintenance approaching.';
        element.actionLabel = 'Learn More';
        element.actionUrl = 'https://example.com/status';

        const actionHandler = jest.fn();
        element.addEventListener('actionclick', actionHandler);

        document.body.appendChild(element);

        const actionBtn = element.shadowRoot.querySelector('lightning-button');
        expect(actionBtn).not.toBeNull();
        expect(actionBtn.label).toBe('Learn More');

        actionBtn.click();
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith('https://example.com/status', '_blank', 'noopener,noreferrer');
    });

    it('auto-dismisses when countdown timer reaches zero', () => {
        jest.useFakeTimers();
        const element = createElement('c-clean-flow-alert-banner', {
            is: CleanFlowAlertBanner
        });
        element.message = 'Temporary notice';
        element.showCountdown = true;
        element.countdownSeconds = 2;

        const dismissHandler = jest.fn();
        element.addEventListener('dismiss', dismissHandler);

        document.body.appendChild(element);

        const badge = element.shadowRoot.querySelector('.countdown-badge');
        expect(badge).not.toBeNull();
        expect(badge.textContent.trim()).toBe('2s');

        // Advance 2 seconds
        jest.advanceTimersByTime(2100);

        return Promise.resolve().then(() => {
            expect(element.isDismissed).toBe(true);
            expect(dismissHandler).toHaveBeenCalled();
        });
    });
});
