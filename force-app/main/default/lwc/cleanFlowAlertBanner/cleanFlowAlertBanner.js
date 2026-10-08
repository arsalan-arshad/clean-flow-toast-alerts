import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { playSynthesizedSound } from 'c/cleanFlowAudioHelper';

export default class CleanFlowAlertBanner extends NavigationMixin(LightningElement) {
    @api title = '';
    @api message = '';
    @api variant = 'info'; // info, success, warning, error, offline
    @api iconName = '';
    @api isDismissible = false;
    @api actionLabel = '';
    @api actionUrl = '';
    @api actionRecordId = '';
    @api actionVariant = 'neutral';
    @api showCountdown = false;
    @api countdownSeconds = 5;
    @api playSound = false;
    @api soundType = '';

    // Flow Output Attributes
    _isDismissed = false;
    _dismissCount = 0;

    @api
    get isDismissed() {
        return this._isDismissed;
    }
    set isDismissed(val) {
        this._isDismissed = Boolean(val === true || val === 'true');
    }

    @api
    get dismissCount() {
        return this._dismissCount;
    }
    set dismissCount(val) {
        this._dismissCount = parseInt(val, 10) || 0;
    }

    @track remainingSeconds = 0;
    timerInterval = null;

    connectedCallback() {
        if (this.playSound) {
            playSynthesizedSound(this.soundType || this.variant);
        }

        if (this.showCountdown && this.countdownSeconds > 0) {
            this.remainingSeconds = parseInt(this.countdownSeconds, 10);
            this.startCountdown();
        }
    }

    disconnectedCallback() {
        this.clearTimer();
    }

    startCountdown() {
        this.clearTimer();
        this.timerInterval = setInterval(() => {
            if (this.remainingSeconds > 1) {
                this.remainingSeconds -= 1;
            } else {
                this.remainingSeconds = 0;
                this.clearTimer();
                this.handleDismiss();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    handleDismiss() {
        this.clearTimer();
        this._isDismissed = true;
        this._dismissCount += 1;

        this.dispatchEvent(
            new CustomEvent('dismiss', {
                detail: {
                    dismissed: true,
                    dismissCount: this._dismissCount
                }
            })
        );
    }

    handleActionClick() {
        if (this.actionRecordId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.actionRecordId,
                    actionName: 'view'
                }
            });
        } else if (this.actionUrl) {
            window.open(this.actionUrl, '_blank', 'noopener,noreferrer');
        }

        this.dispatchEvent(
            new CustomEvent('actionclick', {
                detail: {
                    actionLabel: this.actionLabel,
                    actionUrl: this.actionUrl,
                    actionRecordId: this.actionRecordId
                }
            })
        );
    }

    get hasAction() {
        return Boolean(this.actionLabel && (this.actionUrl || this.actionRecordId));
    }

    get computedContainerClass() {
        const v = (this.variant || 'info').toLowerCase();
        let themeClass = 'alert-theme-info';
        if (v === 'success') {
            themeClass = 'alert-theme-success';
        } else if (v === 'warning') {
            themeClass = 'alert-theme-warning';
        } else if (v === 'error') {
            themeClass = 'alert-theme-error';
        } else if (v === 'offline') {
            themeClass = 'alert-theme-offline';
        }

        return `slds-notify slds-notify_alert ${themeClass}`;
    }

    get computedIconName() {
        if (this.iconName) {
            return this.iconName;
        }
        const v = (this.variant || 'info').toLowerCase();
        switch (v) {
            case 'success':
                return 'utility:success';
            case 'warning':
                return 'utility:warning';
            case 'error':
                return 'utility:error';
            case 'offline':
                return 'utility:offline';
            case 'info':
            default:
                return 'utility:info';
        }
    }

    get computedIconVariant() {
        const v = (this.variant || 'info').toLowerCase();
        return v === 'warning' ? '' : 'inverse';
    }

    get computedIconContainerClass() {
        return 'slds-icon_container slds-m-right_x-small';
    }

    get assistiveText() {
        return (this.variant || 'info').toUpperCase();
    }

    get progressBarStyle() {
        const total = parseInt(this.countdownSeconds, 10) || 1;
        const current = this.remainingSeconds;
        const pct = Math.max(0, Math.min(100, (current / total) * 100));
        return `width: ${pct}%;`;
    }
}
