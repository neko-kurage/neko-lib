import { EventRegistry } from "./eventRegistry";

export class EventListener<
  TA = undefined,
  TB = undefined,
  TC = undefined,
  TD = undefined,
  TE = undefined,
  TF = undefined,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private callbacks: Map<string, EventRegistry<TA, TB, TC, TD, TE, TF>[]>;

  constructor() {
    this.callbacks = new Map();
  }

  public add(
    name: string,
    // eslint-disable-next-line no-unused-vars
    callback?: (argA: TA, argB: TB, argC: TC, argD: TD, argE: TE, argF: TF) => void,
    scope?: object
  ): void {
    if (!this.callbacks.has(name)) {
      this.callbacks.set(name, []);
    }

    if (callback === undefined) return;

    let event: EventRegistry<TA, TB, TC, TD, TE, TF>;
    if (scope === undefined) {
      event = new EventRegistry<TA, TB, TC, TD, TE, TF>(this, name, callback, callback);
    } else {
      event = new EventRegistry<TA, TB, TC, TD, TE, TF>(this, name, callback, scope);
    }

    this.callbacks.get(name)?.push(event);
  }

  /*
  public remove(name: string, callback: object) {
    if (name) {
      if (this.callbacks.has(name)) {
        this.callbacks
      }
    }
  }
  */

  dispatch(name: string, argA?: TA, argB?: TB, argC?: TC, argD?: TD, argE?: TE, argF?: TF): void {
    if (!this.callbacks.has(name)) {
      throw new Error(`'${name}'イベントは登録されていません。`);
    }

    for (const event of this.callbacks.get(name)!) {
      event.callback.call(event.scope, <TA>argA, <TB>argB, <TC>argC, <TD>argD, <TE>argE, <TF>argF);
    }
  }
}
