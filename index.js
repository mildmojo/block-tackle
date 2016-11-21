/*
 * block-tackle
 *
 * Detects when your event loop becomes blocked.
 *
 * Usage:
 *   const BlockTackle = require('block-tackle');
 *   const tackler = new BlockTackle({ checkInterval: 500, minBlockTime: 3000 });
 *   tackler.on('blocked', blockTime => {
 *     const blockSeconds = Math.round(blockTime / 1000, 1);
 *     console.log(`We got blocked for ${blockSeconds}s!`);
 *   });
 */

/* jshint esversion:6 */

const EventEmitter = require('events').EventEmitter;

class BlockTackle extends EventEmitter {
  constructor(options) {
    super();
    this.checkInterval = options.checkInterval || 500;
    this.minBlockTime = options.minBlockTime || 3000;
    this._lastCheckAt = Date.now();
    this._loop();
    this.on('blocked', this._reporter);
  }

  on() {
    super.on.apply(this, arguments);
    // Magic! EventEmitter's _events[x] is the function to fire if there's only
    // one, or an array of functions if there are several. So if there are
    // several, unregister our built-in reporter.
    if (typeof this._events['blocked'] !== 'function') {
      this.removeListener('blocked', this._reporter);
    }
  }

  stop() {
    clearTimeout(this._loopHandle);
  }

  _loop() {
    const elapsed = Date.now() - this._lastCheckAt;

    if (elapsed > this.minBlockTime) {
      this.emit('blocked', elapsed);
    }

    this._loopHandle = setTimeout(this._loop.bind(this), this.checkInterval).unref();
    this._lastCheckAt = Date.now();
  }

  _reporter(blockTime) {
    const blockSeconds = (blockTime / 1000).toFixed(1);
    console.warn(`Event loop blocked for ${blockSeconds}s (PID ${process.pid})`);
  }
}

module.exports = BlockTackle;
