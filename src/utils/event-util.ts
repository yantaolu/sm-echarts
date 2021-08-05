const eventQueues: { [type: string]: ((e: Event) => void)[] } = {};

export default class EventUtil {
  constructor() {
    throw new Error('静态工具类禁止实例化');
  }

  static addEventListener = (type: string, callback: (e: Event) => void) => {
    if (!eventQueues[type]) {
      eventQueues[type] = [];
    }

    eventQueues[type].push(callback);

    const eventType = type.split('.')[0];

    if (window.addEventListener) {
      window.addEventListener(eventType, callback, false);
      return;
    }
    // @ts-ignore
    if (window.attachEvent) {
      // @ts-ignore
      window.attachEvent(`on${eventType}`, callback);
    }
  };

  static removeEventListener = (type: string, callback: (e: Event) => void) => {

    eventQueues[type] = eventQueues[type]?.filter(fn => fn !== callback);

    const eventType = type.split('.')[0];

    if (window.removeEventListener) {
      window.removeEventListener(eventType, callback, false);
      return;
    }
    // @ts-ignore
    if (window.detachEvent) {
      // @ts-ignore
      window.detachEvent(`on${eventType}`, callback);
    }
  };

  static triggerEvent = (type: string) => {
    // @ts-ignore
    eventQueues[type]?.forEach(callback => callback({ type }));
  };
}
