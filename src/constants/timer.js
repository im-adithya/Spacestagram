export class Timer {
  constructor(callback, delay) {
    var timerId,
      start,
      remaining = delay;

    this.kill = function () {
      this.pause();
      remaining = 0;
      this.resume();
    };

    this.pause = function () {
      window.clearTimeout(timerId);
      timerId = null;
      remaining -= Date.now() - start;
    };

    this.resume = function () {
      if (timerId) {
        return;
      }

      start = Date.now();
      timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
  }
}
