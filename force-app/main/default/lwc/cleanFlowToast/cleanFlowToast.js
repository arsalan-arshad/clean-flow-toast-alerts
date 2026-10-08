import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { FlowNavigationNextEvent, FlowNavigationFinishEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';
import { playSynthesizedSound } from 'c/cleanFlowAudioHelper';

export default class CleanFlowToast extends NavigationMixin(LightningElement) {
    @api title = '';
    @api message = '';
    @api variant = 'info'; // info, success, warning, error
    @api mode = 'dismissible'; // dismissible, pester, sticky
    @api url = '';
    @api urlLabel = '';
    @api recordId = '';
    @api delayMs = 150;
    @api autoAdvance = false;
    @api playSound = false;
    @api soundType = 'chime';
    @api availableActions = [];

    hasFired = false;

    connectedCallback() {
        if (!this.hasFired) {
            this.hasFired = true;
            const delay = Math.max(0, parseInt(this.delayMs, 10) || 0);
            // Delay slightly to ensure UI has mounted
            setTimeout(() => {
                this.fireToast();
                if (this.autoAdvance) {
                    this.advanceFlow();
                }
            }, delay);
        }
    }

    fireToast() {
        const toastVariant = (this.variant || 'info').toLowerCase();
        const toastMode = (this.mode || 'dismissible').toLowerCase();

        let messageBody = this.message || '';
        let messageData = [];

        if (this.url || this.recordId) {
            const targetUrl = this.url || `/lightning/r/${this.recordId}/view`;
            const linkText = this.urlLabel || 'View Record';
            if (messageBody.includes('{0}')) {
                messageData = [{ url: targetUrl, label: linkText }];
            } else {
                messageBody = `${messageBody} {0}`.trim();
                messageData = [{ url: targetUrl, label: linkText }];
            }
        }

        const toastEvt = new ShowToastEvent({
            title: this.title || '',
            message: messageBody,
            messageData: messageData.length > 0 ? messageData : undefined,
            variant: toastVariant,
            mode: toastMode
        });
        this.dispatchEvent(toastEvt);

        if (this.playSound) {
            playSynthesizedSound(this.soundType || toastVariant);
        }
    }

    advanceFlow() {
        if (this.availableActions && this.availableActions.includes('NEXT')) {
            const nextEvent = new FlowNavigationNextEvent();
            this.dispatchEvent(nextEvent);
        } else if (this.availableActions && this.availableActions.includes('FINISH')) {
            const finishEvent = new FlowNavigationFinishEvent();
            this.dispatchEvent(finishEvent);
        }
    }

    handleManualAdvance() {
        this.advanceFlow();
    }

    get displayTitle() {
        return this.title || 'Notification';
    }

    get hasLink() {
        return Boolean(this.url || this.recordId);
    }

    get computedLinkUrl() {
        return this.url || `/lightning/r/${this.recordId}/view`;
    }

    get displayLinkLabel() {
        return this.urlLabel || 'View Details';
    }

    get showManualAdvance() {
        return (
            this.availableActions &&
            (this.availableActions.includes('NEXT') || this.availableActions.includes('FINISH'))
        );
    }

    get computedIconName() {
        switch ((this.variant || '').toLowerCase()) {
            case 'success':
                return 'utility:success';
            case 'warning':
                return 'utility:warning';
            case 'error':
                return 'utility:error';
            default:
                return 'utility:info';
        }
    }

    get computedIconVariant() {
        const v = (this.variant || '').toLowerCase();
        return v === 'info' ? '' : v;
    }
}
