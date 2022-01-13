export default class Timer {
    constructor(options) {
        // default settings
        this._interval = 1;
        this._startTime = 0;
        this._endTime = 1200; // 20 minutes
        this._eventElement = document.body;
        this._resetEvents = ['keydown', 'mousedown'];
        this._startNow = true;
        this._increment = true;

        // user override options
        this.interval = 1000 * (options.interval || this._interval);
        this.endTime = (!isNaN(options.endTime)) ? options.endTime : this._endTime;
        this.startTime = (!isNaN(options.startTime)) ? options.startTime : this._startTime;
        this.eventElement = options.eventElement || this._eventElement;
        this.resetEvents = (options.noEventReset) ? [] : (options.resetEvents || this._resetEvents);
        this.startNow = (options.startNow === false) ? options.startNow : this._startNow;
        this.increment = options.increment || this._increment;

        // user definable functions
        this.onInit = options.onInit || null;
        this.onStart = options.onStart || null;
        this.onStop = options.onStop || null;
        this.onInterval = options.onInterval || null;
        this.onReset = options.onReset || null;
        this.onComplete = options.onComplete || null;

        // timer
        this.timer = null;
        this.time = this.startTime;

        if(this.eventElement && this.resetEvents && this.resetEvents.length) {
            this.listen();
        }

        if(this.onInit) {
            this.onInit(this);
        }

        if(this.startNow) {
            this.startTimer();
        }
    }

    resetTime() {
        this.time = this._startTime;

        if(this.onReset) {
            this.onReset(this);
        }

        return this;
    }

    listen() {
        this.resetEvents.forEach((event) => {
            this.eventElement.addEventListener(event, (e) => {
                if(this.timer) {
                    this.resetTime();
                }
            }, true);
        });
    }

    getTime() {
        return this.time;
    }

    startTimer() {
        if(!this.timer) {
            this.timer = setInterval(() => {
                if(this.increment) {
                    this.time++;
                    if(this.time >= this.endTime) {
                        this.stopTimer();
                        this.onComplete(this);

                        return this;
                    }
                } else {
                    this.time--;
                    if(this.time <= this.endTime) {
                        this.stopTimer();
                        this.onComplete(this);

                        return this;
                    }
                }

                if(this.onInterval) {
                    this.onInterval(this);
                }
            }, this.interval);
        }

        if(this.onStart) {
            this.onStart(this);
        }

        return this;
    }

    stopTimer() {
        if(this.timer) {
            this.timer = clearInterval(this.timer);
        }

        if(this.onStop) {
            this.onStop(this);
        }

        return this;
    }
}
