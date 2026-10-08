export class FlowNavigationNextEvent extends CustomEvent {
    constructor() {
        super('lightning__flownavigationnext', { bubbles: true, composed: true });
    }
}

export class FlowNavigationFinishEvent extends CustomEvent {
    constructor() {
        super('lightning__flownavigationfinish', { bubbles: true, composed: true });
    }
}

export class FlowNavigationBackEvent extends CustomEvent {
    constructor() {
        super('lightning__flownavigationback', { bubbles: true, composed: true });
    }
}

export class FlowNavigationPauseEvent extends CustomEvent {
    constructor() {
        super('lightning__flownavigationpause', { bubbles: true, composed: true });
    }
}

export const FlowAttributeChangeEvent = jest.fn();
