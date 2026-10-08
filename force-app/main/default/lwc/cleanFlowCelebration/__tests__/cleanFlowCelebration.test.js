import { createElement } from 'lwc';
import CleanFlowCelebration from 'c/cleanFlowCelebration';

beforeAll(() => {
    window.open = jest.fn();
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
        clearRect: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        fillRect: jest.fn(),
        fillStyle: '',
        globalAlpha: 1
    });

    global.requestAnimationFrame = jest.fn((callback) => {
        return setTimeout(callback, 16);
    });
    global.cancelAnimationFrame = jest.fn((id) => {
        clearTimeout(id);
    });
});

describe('c-clean-flow-celebration', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('renders celebration card with title, badge, and subtitle', () => {
        const element = createElement('c-clean-flow-celebration', {
            is: CleanFlowCelebration
        });
        element.cardTitle = 'Goal Achieved!';
        element.cardSubtitle = '100% quota reached for Q4.';
        element.badgeText = 'TOP PERFORMER';
        element.showCard = true;
        element.playSound = false;

        document.body.appendChild(element);

        const titleEl = element.shadowRoot.querySelector('.celebration-title');
        expect(titleEl).not.toBeNull();
        expect(titleEl.textContent).toBe('Goal Achieved!');

        const badgeEl = element.shadowRoot.querySelector('.celebration-badge');
        expect(badgeEl.textContent).toBe('TOP PERFORMER');

        const subtitleEl = element.shadowRoot.querySelector('.celebration-subtitle');
        expect(subtitleEl.textContent).toBe('100% quota reached for Q4.');
    });

    it('initializes canvas and creates particles', () => {
        const element = createElement('c-clean-flow-celebration', {
            is: CleanFlowCelebration
        });
        element.particleCount = 50;
        element.playSound = false;

        document.body.appendChild(element);

        expect(element.activeParticleCount).toBe(50);
        expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('handles action button click', () => {
        const element = createElement('c-clean-flow-celebration', {
            is: CleanFlowCelebration
        });
        element.actionButtonLabel = 'View Dashboard';
        element.actionButtonUrl = 'https://example.com/dash';
        element.playSound = false;

        const actionHandler = jest.fn();
        element.addEventListener('actionclick', actionHandler);

        document.body.appendChild(element);

        const buttons = element.shadowRoot.querySelectorAll('lightning-button');
        const actionBtn = Array.from(buttons).find((b) => b.label === 'View Dashboard');
        expect(actionBtn).toBeDefined();

        actionBtn.click();
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith('https://example.com/dash', '_blank', 'noopener,noreferrer');
    });

    it('parses custom hex colors correctly', () => {
        const element = createElement('c-clean-flow-celebration', {
            is: CleanFlowCelebration
        });
        element.colors = '#ff0000, #00ff00, #0000ff';
        element.playSound = false;

        document.body.appendChild(element);

        expect(element.activeColors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
    });
});
