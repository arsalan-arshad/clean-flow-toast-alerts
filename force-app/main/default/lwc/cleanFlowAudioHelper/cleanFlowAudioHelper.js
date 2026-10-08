/**
 * @description Zero-dependency Web Audio API synthesizer for clean notification chimes.
 *              100% offline, native browser oscillator, no external assets or CSP issues.
 */
export function playSynthesizedSound(soundType) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return;
        }

        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;
        const normalized = (soundType || 'chime').toLowerCase();

        switch (normalized) {
            case 'success': {
                // 3-note ascending major triad (C5 -> E5 -> G5)
                playTone(ctx, 523.25, now, 0.15, 'sine');
                playTone(ctx, 659.25, now + 0.12, 0.18, 'sine');
                playTone(ctx, 783.99, now + 0.24, 0.35, 'sine');
                break;
            }
            case 'bell': {
                // Crisp notification bell with decaying harmonic
                playTone(ctx, 880.0, now, 0.4, 'sine', 0.25);
                playTone(ctx, 1760.0, now, 0.2, 'triangle', 0.08);
                break;
            }
            case 'warning': {
                // Subtle attention two-tone
                playTone(ctx, 440.0, now, 0.15, 'triangle', 0.2);
                playTone(ctx, 369.99, now + 0.15, 0.25, 'triangle', 0.2);
                break;
            }
            case 'error': {
                // Low descending tone
                playTone(ctx, 261.63, now, 0.2, 'sawtooth', 0.15);
                playTone(ctx, 196.0, now + 0.15, 0.3, 'sawtooth', 0.15);
                break;
            }
            case 'fanfare':
            case 'tada': {
                // Celebratory fanfare (C5, E5, G5, High C6)
                playTone(ctx, 523.25, now, 0.12, 'triangle', 0.2);
                playTone(ctx, 659.25, now + 0.12, 0.12, 'triangle', 0.2);
                playTone(ctx, 783.99, now + 0.24, 0.15, 'triangle', 0.25);
                playTone(ctx, 1046.5, now + 0.38, 0.6, 'triangle', 0.3);
                break;
            }
            case 'chime':
            default: {
                // Soft 2-note chime (F5 -> A5)
                playTone(ctx, 698.46, now, 0.15, 'sine', 0.2);
                playTone(ctx, 880.0, now + 0.12, 0.3, 'sine', 0.2);
                break;
            }
        }
    } catch (e) {
        // Audio playback failure (e.g. autoplay restriction) handled silently
    }
}

function playTone(ctx, freq, startTime, duration, type = 'sine', volume = 0.2) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
}
