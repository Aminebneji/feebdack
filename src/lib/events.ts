
type BaseEventDefinition = Record<string, unknown>;

//fonctio de callback.
type EventCallback<PayloadType> = (payload: PayloadType) => void;

//une classe qui permet de sécuriser la gestion des events en bloquant.
class EventEmitter<EventsRegistry extends BaseEventDefinition> {
    private eventListeners: {
        [EventName in keyof EventsRegistry]?: EventCallback<EventsRegistry[EventName]>[];
    } = {};

    //Subscribe to an event.
    on<EventName extends keyof EventsRegistry>(
        eventName: EventName,
        callback: EventCallback<EventsRegistry[EventName]>
    ) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }

        this.eventListeners[eventName]!.push(callback);

        return () => this.off(eventName, callback);
    }

    //Unsubscribe from an event.
    off<EventName extends keyof EventsRegistry>(
        eventName: EventName,
        callback: EventCallback<EventsRegistry[EventName]>
    ) {
        const listeners = this.eventListeners[eventName];
        if (!listeners) return;

        this.eventListeners[eventName] = listeners.filter(
            (registeredCallback) => registeredCallback !== callback
        );
    }

    // emettre un event avec un payload <-(infos associés à l'envent) optionnel.
    emit<EventName extends keyof EventsRegistry>(
        eventName: EventName,
        ...args: EventsRegistry[EventName] extends void ? [] : [EventsRegistry[EventName]]
    ) {
        const payload = args[0] as EventsRegistry[EventName];
        const listeners = this.eventListeners[eventName];

        if (!listeners) return;

        listeners.forEach((callback) => callback(payload));
    }
}

export const EVENTS = {
    SITE_CHANGED: "site:changed",
    FEEDBACK_CHANGED: "feedback:changed",
} as const;

//Specific events.
type AppEventsRegistry = {
    [EVENTS.SITE_CHANGED]: void;
    [EVENTS.FEEDBACK_CHANGED]: void;
};

//Instance pour une application de la gestion des events.
export const eventEmitter = new EventEmitter<AppEventsRegistry>();
