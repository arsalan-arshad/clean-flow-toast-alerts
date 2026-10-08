import { LightningElement, track, api } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id';
import { playSynthesizedSound } from 'c/cleanFlowAudioHelper';

const CHANNEL_NAME = '/event/Clean_Flow_Toast_Event__e';

export default class CleanFlowToastListener extends LightningElement {
    _isSubscribed = false;
    @api
    get isSubscribed() {
        return this._isSubscribed;
    }
    set isSubscribed(val) {
        this._isSubscribed = val;
    }

    @api currentUserId = USER_ID;
    @track toastHistory = [];

    @api
    get currentHistory() {
        return this.toastHistory;
    }

    @api
    get hasHistoryItems() {
        return this.toastHistory.length > 0;
    }

    subscription = {};

    connectedCallback() {
        this.registerErrorListener();
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    registerErrorListener() {
        onError(() => {
            // EMP API errors logged silently or reconnected
            this._isSubscribed = false;
        });
    }

    handleSubscribe() {
        if (this._isSubscribed) {
            return;
        }

        const messageCallback = (response) => {
            this.handleIncomingToastEvent(response);
        };

        subscribe(CHANNEL_NAME, -1, messageCallback)
            .then((response) => {
                this.subscription = response;
                this._isSubscribed = true;
            })
            .catch(() => {
                this._isSubscribed = false;
            });
    }

    handleUnsubscribe() {
        if (this.subscription && this.subscription.id) {
            unsubscribe(this.subscription, () => {
                this._isSubscribed = false;
                this.subscription = {};
            });
        }
    }

    handleReconnect() {
        this.handleUnsubscribe();
        this.handleSubscribe();
    }

    handleIncomingToastEvent(response) {
        if (!response || !response.data || !response.data.payload) {
            return;
        }

        const payload = response.data.payload;
        const targetUserId = payload.Target_User_Id__c;

        // User targeting filter: if targetUserId is set and doesn't match current user, ignore
        if (targetUserId && this.currentUserId && targetUserId !== this.currentUserId) {
            return;
        }

        const title = payload.Title__c || '';
        let message = payload.Message__c || '';
        const variant = (payload.Variant__c || 'info').toLowerCase();
        const mode = (payload.Mode__c || 'dismissible').toLowerCase();
        const url = payload.Url__c;
        const urlLabel = payload.Url_Label__c || 'View Record';
        const recordId = payload.Record_Id__c;
        const playSound = payload.Play_Sound__c === true;
        const soundType = payload.Sound_Type__c;

        let messageData = [];
        if (url || recordId) {
            const targetUrl = url || `/lightning/r/${recordId}/view`;
            if (message.includes('{0}')) {
                messageData = [{ url: targetUrl, label: urlLabel }];
            } else {
                message = `${message} {0}`.trim();
                messageData = [{ url: targetUrl, label: urlLabel }];
            }
        }

        // Fire the browser toast notification
        const toastEvt = new ShowToastEvent({
            title,
            message,
            messageData: messageData.length > 0 ? messageData : undefined,
            variant,
            mode
        });
        this.dispatchEvent(toastEvt);

        // Optional sound synthesis
        if (playSound) {
            playSynthesizedSound(soundType || variant);
        }

        // Add to recent history list
        this.addToHistory({
            title: title || 'Notification',
            message: payload.Message__c,
            variant,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
    }

    addToHistory(item) {
        const historyItem = {
            id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            title: item.title,
            message: item.message,
            variant: item.variant,
            time: item.time,
            badgeClass: this.computeBadgeClass(item.variant)
        };

        this.toastHistory = [historyItem, ...this.toastHistory].slice(0, 15);
    }

    computeBadgeClass(variant) {
        switch ((variant || '').toLowerCase()) {
            case 'success':
                return 'slds-badge slds-theme_success';
            case 'warning':
                return 'slds-badge slds-theme_warning';
            case 'error':
                return 'slds-badge slds-theme_error';
            default:
                return 'slds-badge slds-badge_lightest';
        }
    }

    handleClearHistory() {
        this.toastHistory = [];
    }

    get hasHistory() {
        return this.toastHistory.length > 0;
    }

    get historyCount() {
        return this.toastHistory.length;
    }
}
