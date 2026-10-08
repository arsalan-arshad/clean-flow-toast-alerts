import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { playSynthesizedSound } from 'c/cleanFlowAudioHelper';

const DEFAULT_COLORS = ['#0070d2', '#4bca81', '#ffb75d', '#ea001e', '#9050e9', '#00c6b7', '#ff5388'];

export default class CleanFlowCelebration extends NavigationMixin(LightningElement) {
    @api celebrationType = 'confetti'; // confetti, cannons, fireworks, pride_rain
    @api duration = 4; // duration in seconds
    @api particleCount = 120;
    @api colors = '';
    @api cardTitle = '🎉 Congratulations!';
    @api cardSubtitle = 'Your task or process has finished successfully.';
    _showCard = true;
    @api
    get showCard() {
        return this._showCard;
    }
    set showCard(val) {
        this._showCard = Boolean(val === true || val === 'true');
    }

    _playSound = true;
    @api
    get playSound() {
        return this._playSound;
    }
    set playSound(val) {
        this._playSound = Boolean(val === true || val === 'true');
    }
    @api soundType = 'fanfare';
    @api badgeText = 'MILESTONE REACHED';
    @api actionButtonLabel = '';
    @api actionButtonUrl = '';
    @api actionButtonRecordId = '';

    @api
    get activeColors() {
        return this.parsedColors;
    }

    @api
    get activeParticleCount() {
        return this.particles ? this.particles.length : 0;
    }

    canvas = null;
    ctx = null;
    particles = [];
    animationId = null;
    startTime = 0;
    isRendered = false;

    renderedCallback() {
        if (!this.isRendered) {
            this.isRendered = true;
            this.setupCanvas();
            this.startCelebration();
        }
    }

    disconnectedCallback() {
        this.stopAnimation();
    }

    setupCanvas() {
        this.canvas = this.template.querySelector('.celebration-canvas');
        if (this.canvas) {
            const container = this.template.querySelector('.celebration-container');
            const rect = container ? container.getBoundingClientRect() : { width: 600, height: 300 };
            this.canvas.width = Math.max(rect.width, 300);
            this.canvas.height = Math.max(rect.height, 220);
            this.ctx = this.canvas.getContext('2d');
        }
    }

    startCelebration() {
        if (this.playSound) {
            playSynthesizedSound(this.soundType || 'fanfare');
        }

        this.particles = this.createParticles();
        this.startTime = Date.now();
        this.animate();
    }

    createParticles() {
        const count = Math.max(20, parseInt(this.particleCount, 10) || 120);
        const palette = this.parsedColors;
        const width = this.canvas ? this.canvas.width : 600;
        const height = this.canvas ? this.canvas.height : 300;
        const type = (this.celebrationType || 'confetti').toLowerCase();

        const particles = [];
        for (let i = 0; i < count; i++) {
            const color = palette[Math.floor(Math.random() * palette.length)];
            let x = width / 2;
            let y = height / 2;
            let vx = (Math.random() - 0.5) * 12;
            let vy = (Math.random() - 0.7) * 14;

            if (type === 'cannons') {
                const isLeft = i % 2 === 0;
                x = isLeft ? 20 : width - 20;
                y = height - 20;
                vx = isLeft ? Math.random() * 8 + 3 : -(Math.random() * 8 + 3);
                vy = -(Math.random() * 12 + 6);
            } else if (type === 'pride_rain') {
                x = Math.random() * width;
                y = -10;
                vx = (Math.random() - 0.5) * 2;
                vy = Math.random() * 3 + 2;
            }

            particles.push({
                x,
                y,
                vx,
                vy,
                color,
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1,
                decay: 0.98,
                gravity: 0.25
            });
        }
        return particles;
    }

    animate() {
        if (!this.ctx || !this.canvas) {
            return;
        }

        const elapsed = (Date.now() - this.startTime) / 1000;
        const maxDuration = Math.max(1, parseInt(this.duration, 10) || 4);

        if (elapsed > maxDuration) {
            this.stopAnimation();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.decay;
            p.rotation += p.rotationSpeed;

            if (elapsed > maxDuration - 1) {
                p.opacity = Math.max(0, 1 - (elapsed - (maxDuration - 1)));
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            this.ctx.restore();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    handleReplay() {
        this.stopAnimation();
        this.setupCanvas();
        this.startCelebration();
    }

    handleActionClick() {
        if (this.actionButtonRecordId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.actionButtonRecordId,
                    actionName: 'view'
                }
            });
        } else if (this.actionButtonUrl) {
            window.open(this.actionButtonUrl, '_blank', 'noopener,noreferrer');
        }

        this.dispatchEvent(
            new CustomEvent('actionclick', {
                detail: {
                    actionButtonLabel: this.actionButtonLabel,
                    actionButtonUrl: this.actionButtonUrl,
                    actionButtonRecordId: this.actionButtonRecordId
                }
            })
        );
    }

    get displayTitle() {
        return this.cardTitle || '🎉 Congratulations!';
    }

    get hasAction() {
        return Boolean(this.actionButtonLabel && (this.actionButtonUrl || this.actionButtonRecordId));
    }

    get parsedColors() {
        if (this.colors && this.colors.trim().length > 0) {
            const list = this.colors
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c.length > 0);
            if (list.length > 0) {
                return list;
            }
        }
        return DEFAULT_COLORS;
    }
}
