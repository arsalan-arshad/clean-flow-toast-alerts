import { createElement } from 'lwc';
import CleanFlowToast from 'c/cleanFlowToast';
const SHOW_TOAST_EVENT = 'lightning__showtoast';

// Mock Web Audio
window.AudioContext = jest.fn().mockImplementation(() => ({
    currentTime: 0,
    state: 'running',
    resume: jest.fn(),
    createOscillator: jest.fn().mockReturnValue({
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        frequency: { setValueAtTime: jest.fn() }
    }),
    createGain: jest.fn().mockReturnValue({
        connect: jest.fn(),
        gain: {
            setValueAtTime: jest.fn(),
            exponentialRampToValueAtTime: jest.fn()
        }
    }),
    destination: {}
}));

describe('c-clean-flow-toast', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('dispatches ShowToastEvent on mount with proper attributes', () => {
        jest.useFakeTimers();
        const element = createElement('c-clean-flow-toast', {
            is: CleanFlowToast
        });
        element.title = 'Success Alert';
        element.message = 'The record was saved.';
        element.variant = 'success';
        element.mode = 'dismissible';
        element.delayMs = 50;

        const toastHandler = jest.fn();
        element.addEventListener(SHOW_TOAST_EVENT, toastHandler);

        document.body.appendChild(element);

        // Fast-forward delay
        jest.advanceTimersByTime(60);

        expect(toastHandler).toHaveBeenCalledTimes(1);
        const evt = toastHandler.mock.calls[0][0];
        expect(evt.detail.title).toBe('Success Alert');
        expect(evt.detail.message).toBe('The record was saved.');
        expect(evt.detail.variant).toBe('success');
        expect(evt.detail.mode).toBe('dismissible');
    });

    it('attaches link url and label when recordId or url is provided', () => {
        jest.useFakeTimers();
        const element = createElement('c-clean-flow-toast', {
            is: CleanFlowToast
        });
        element.title = 'Created Record';
        element.message = 'New account created';
        element.recordId = '001000000000001AAA';
        element.urlLabel = 'Open Account';
        element.delayMs = 0;

        const toastHandler = jest.fn();
        element.addEventListener(SHOW_TOAST_EVENT, toastHandler);

        document.body.appendChild(element);
        jest.advanceTimersByTime(10);

        expect(toastHandler).toHaveBeenCalled();
        const evt = toastHandler.mock.calls[0][0];
        expect(evt.detail.message).toContain('{0}');
        expect(evt.detail.messageData).toBeDefined();
        expect(evt.detail.messageData[0].url).toBe('/lightning/r/001000000000001AAA/view');
        expect(evt.detail.messageData[0].label).toBe('Open Account');
    });

    it('dispatches FlowNavigationNextEvent when autoAdvance is true and NEXT is available', () => {
        jest.useFakeTimers();
        const element = createElement('c-clean-flow-toast', {
            is: CleanFlowToast
        });
        element.autoAdvance = true;
        element.availableActions = ['NEXT', 'BACK'];
        element.delayMs = 0;

        const nextHandler = jest.fn();
        element.addEventListener('lightning__flownavigationnext', nextHandler);

        document.body.appendChild(element);
        jest.advanceTimersByTime(10);

        expect(nextHandler).toHaveBeenCalled();
    });

    it('renders static card when autoAdvance is false and supports manual advance', () => {
        const element = createElement('c-clean-flow-toast', {
            is: CleanFlowToast
        });
        element.autoAdvance = false;
        element.title = 'Info Banner';
        element.message = 'Please review below.';
        element.availableActions = ['NEXT'];

        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector('.container-card');
        expect(card).not.toBeNull();

        const titleEl = element.shadowRoot.querySelector('h2');
        expect(titleEl.textContent).toBe('Info Banner');

        const nextHandler = jest.fn();
        element.addEventListener('lightning__flownavigationnext', nextHandler);

        const button = element.shadowRoot.querySelector('lightning-button');
        expect(button).not.toBeNull();
        button.click();

        expect(nextHandler).toHaveBeenCalled();
    });
});
