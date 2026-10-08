import { createElement } from 'lwc';
import CleanFlowToastListener from 'c/cleanFlowToastListener';
import { subscribe, unsubscribe } from 'lightning/empApi';

const SHOW_TOAST_EVENT = 'lightning__showtoast';

describe('c-clean-flow-toast-listener', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('subscribes to platform event channel on connectedCallback', () => {
        const element = createElement('c-clean-flow-toast-listener', {
            is: CleanFlowToastListener
        });

        document.body.appendChild(element);

        expect(subscribe).toHaveBeenCalled();
        const channel = subscribe.mock.calls[0][0];
        expect(channel).toBe('/event/Clean_Flow_Toast_Event__e');
    });

    it('dispatches ShowToastEvent when incoming event matches user', () => {
        let eventCallback;
        subscribe.mockImplementation((channel, replayId, callback) => {
            eventCallback = callback;
            return Promise.resolve({ id: 'sub-test' });
        });

        const element = createElement('c-clean-flow-toast-listener', {
            is: CleanFlowToastListener
        });

        const toastHandler = jest.fn();
        element.addEventListener(SHOW_TOAST_EVENT, toastHandler);

        document.body.appendChild(element);

        const mockEvent = {
            data: {
                payload: {
                    Title__c: 'Agentforce Completed',
                    Message__c: 'Opportunity updated by AI agent.',
                    Variant__c: 'success',
                    Mode__c: 'dismissible'
                }
            }
        };

        // Simulate incoming event
        eventCallback(mockEvent);

        expect(toastHandler).toHaveBeenCalledTimes(1);
        const evt = toastHandler.mock.calls[0][0];
        expect(evt.detail.title).toBe('Agentforce Completed');
        expect(evt.detail.message).toBe('Opportunity updated by AI agent.');
        expect(evt.detail.variant).toBe('success');

        expect(element.currentHistory.length).toBe(1);
        expect(element.currentHistory[0].title).toBe('Agentforce Completed');
    });

    it('filters out events meant for a different target user', () => {
        let eventCallback;
        subscribe.mockImplementation((channel, replayId, callback) => {
            eventCallback = callback;
            return Promise.resolve({ id: 'sub-test' });
        });

        const element = createElement('c-clean-flow-toast-listener', {
            is: CleanFlowToastListener
        });
        element.currentUserId = '005000000000001AAA';

        const toastHandler = jest.fn();
        element.addEventListener(SHOW_TOAST_EVENT, toastHandler);

        document.body.appendChild(element);

        const mockEventOtherUser = {
            data: {
                payload: {
                    Title__c: 'Secret Notification',
                    Message__c: 'For user 2 only',
                    Target_User_Id__c: '005000000000002BBB'
                }
            }
        };

        eventCallback(mockEventOtherUser);

        expect(toastHandler).not.toHaveBeenCalled();
        expect(element.currentHistory.length).toBe(0);
    });

    it('clears history when clear button is clicked', () => {
        let eventCallback;
        subscribe.mockImplementation((channel, replayId, callback) => {
            eventCallback = callback;
            return Promise.resolve({ id: 'sub-test' });
        });

        const element = createElement('c-clean-flow-toast-listener', {
            is: CleanFlowToastListener
        });

        document.body.appendChild(element);

        eventCallback({
            data: {
                payload: {
                    Title__c: 'Item 1',
                    Message__c: 'Test 1'
                }
            }
        });

        return Promise.resolve().then(() => {
            expect(element.hasHistoryItems).toBe(true);

            const clearBtn = element.shadowRoot.querySelector('lightning-button');
            expect(clearBtn).not.toBeNull();
            clearBtn.click();

            return Promise.resolve().then(() => {
                expect(element.hasHistoryItems).toBe(false);
                expect(element.currentHistory.length).toBe(0);
            });
        });
    });

    it('unsubscribes on disconnectedCallback', () => {
        let capturedCallback;
        subscribe.mockImplementation((ch, rep, cb) => {
            capturedCallback = cb;
            return Promise.resolve({ id: 'sub-test-id' });
        });
        unsubscribe.mockImplementation((sub, cb) => {
            if (cb) cb();
            return Promise.resolve(true);
        });

        const element = createElement('c-clean-flow-toast-listener', {
            is: CleanFlowToastListener
        });

        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            document.body.removeChild(element);
            expect(unsubscribe).toHaveBeenCalled();
        });
    });
});
