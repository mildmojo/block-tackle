# block-tackle

This module runs a background timer to check whether synchronous code has
blocked the Node.js event loop for too long. When combined with app-specific
logging, this can help you figure out what actions are blocking your runtime.
For example, if you see a blocking message alongside your file upload log
messages, maybe your upload post-processing is blocking the process.

Out of the box, the module logs blocking behavior in the form:

`Event loop blocked for 2.8s (PID 2189)`

This module currently has no dependencies.

## Behavior

On construction, a BlockTackle object starts an internal timer that fires
every `checkInterval` milliseconds. It measures the time since the timer was
queued and fires a `blocked` event if the total time is more than `minBlockTime`
milliseconds.

I've been using similar code (NOT this module) in a production app for a couple
of years. I'm not the first one to come up with this idea, but I couldn't find
a pre-existing node module for it.

## Usage

```javascript
const BlockTackle = require('block-tackle');
const tackler = new BlockTackle({ checkInterval: 500, minBlockTime: 3000 });

// Providing an event listener turns off built-in log messages.
tackler.on('blocked', blockTime => {
  const blockSeconds = (blockTime / 1000).toFixed(1);
  console.log(`We got blocked for ${blockSeconds}s!`);
});

...

// Maybe stop the timer if you just don't care anymore.
tackler.stop();
```

## Tests

Run the tests with `npm test`.

## License

MIT License

Copyright (c) 2016 mildmojo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
