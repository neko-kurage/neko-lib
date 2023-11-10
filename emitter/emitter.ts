type Callback<Values> = (values: Values) => void;
type Observers<T extends object> = { [K in keyof T]?: Map<object, Observer<T[K]>> };

class Observer<Values> {
  public readonly callback: Callback<Values>;
  public readonly once: boolean;

  constructor(callback: Callback<Values>, once: boolean) {
    this.callback = callback;
    this.once = once;
  }
}

export class Emitter<T extends object> {
  private readonly observers: Observers<T>;

  constructor() {
    this.observers = {};
  }

  private addObserver<EventName extends keyof T>(
    eventName: EventName,
    callback: Callback<T[EventName]> | undefined,
    scope: object | undefined,
    once: boolean
  ): void {
    let eventObservers = this.observers[eventName];
    if (eventObservers == undefined) {
      eventObservers = this.observers[eventName] = new Map();
    }

    if (callback == undefined) return;

    const observer = new Observer(callback, once);
    if (scope == undefined) {
      eventObservers.set(callback, observer);
    } else {
      eventObservers.set(scope, observer);
    }
  }

  on<EventName extends keyof T>(eventName: EventName, callback?: Callback<T[EventName]>, scope?: object): void {
    this.addObserver(eventName, callback, scope, false);
  }

  once<EventName extends keyof T>(eventName: EventName, callback?: Callback<T[EventName]>, scope?: object): void {
    this.addObserver(eventName, callback, scope, true);
  }

  off<EventName extends keyof T>(eventName: EventName, scope?: object): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`'${String(eventName)}' event has not been register.`);
    }

    if (scope == undefined) {
      eventObservers.clear();
      return;
    }

    if (!eventObservers.has(scope)) {
      throw new Error(`'${String(eventName)}' could not be delete, because it does not exist in '${scope}'`);
    } else {
      eventObservers.delete(scope);
    }
  }

  clear<EventName extends keyof T>(): void {
    Object.keys(this.observers).forEach((key) => {
      this.off(key as EventName);
    });
  }

  fire<EventName extends keyof T>(eventName: EventName, values: T[EventName]): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`'${String(eventName)}' event has not been register.`);
    }

    for (const scope of eventObservers.keys()) {
      const event = eventObservers.get(scope);
      event!.callback.call(scope, values);

      if (event!.once) this.off(eventName, scope);
    }
  }

  fireScope<EventName extends keyof T>(eventName: EventName, scope: object, values: T[EventName]): void {
    const eventObservers = this.observers[eventName];

    if (eventObservers == undefined) {
      throw new Error(`'${String(eventName)}' event has not been register.`);
    }

    const event = eventObservers.get(scope);
    event!.callback.call(scope, values);

    if (event!.once) this.off(eventName, scope);
  }

  get debugCallbacks(): Observers<T> {
    return this.observers;
  }
}
