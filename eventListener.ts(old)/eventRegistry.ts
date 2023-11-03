import { EventListener } from "./eventListener";

export class EventRegistry<TA, TB, TC, TD, TE, TF> {
  public listener: EventListener<TA, TB, TC, TD, TE, TF>;
  public name: string;
  // eslint-disable-next-line no-unused-vars
  public callback: (argA: TA, argB: TB, argC: TC, argD: TD, argE: TE, argF: TF) => void;
  public scope: object;

  constructor(
    listener: EventListener<TA, TB, TC, TD, TE, TF>,
    name: string,
    // eslint-disable-next-line no-unused-vars
    callback: (argA: TA, argB: TB, argC: TC, argD: TD, argE: TE, argF: TF) => void,
    scope: object
  ) {
    this.listener = listener;
    this.name = name;
    this.callback = callback;
    this.scope = scope;
  }
}
