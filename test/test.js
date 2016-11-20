/* jshint esversion:6 */

const BlockTackle = require('../index');

const colorDkGrey = '\033[37m';
const colorRed    = '\033[1m\033[31m';
const colorGreen  = '\033[1m\033[32m';
const colorNormal = '\033[0m';

var tests = {
  'BlockTackle': {
    'should console warn when the event loop blocks': function(done) {
      const minBlockTime = 200;
      const checkInterval = 100;
      const tackler = new BlockTackle({ checkInterval, minBlockTime });
      const startAt = Date.now();
      let consoleMsg = '';

      const oldWarn = console.warn;
      console.warn = msg => consoleMsg = msg;

      // Block for a little while.
      while (Date.now() < startAt + minBlockTime + 100) {}

      setImmediate(function asserts() {
        tackler.stop();
        console.warn = oldWarn;
        done(consoleMsg !== '');
      });
    },

    'should emit an event when the event loop blocks': function(done) {
      const minBlockTime = 200;
      const checkInterval = 100;
      const tackler = new BlockTackle({ checkInterval, minBlockTime });
      const startAt = Date.now();
      let blockTime = 0;

      // Capture blocking time from blocked event.
      tackler.on('blocked', time => blockTime = time);

      // Block for a little while.
      while (Date.now() < startAt + minBlockTime + 100) {}

      setImmediate(function asserts() {
        tackler.stop();
        done(blockTime >= minBlockTime);
      });
    },

    'should not emit an event if stopped': function(done) {
      const minBlockTime = 200;
      const checkInterval = 100;
      const tackler = new BlockTackle({ checkInterval, minBlockTime });
      const startAt = Date.now();
      let blockTime = 0;

      // Capture blocking time from blocked event.
      tackler.on('blocked', time => blockTime = time);
      // Stop the loop.
      tackler.stop();

      // Block for a little while.
      while (Date.now() < startAt + minBlockTime + 100) {}

      setImmediate(function asserts() {
        tackler.stop();
        done(blockTime === 0);
      });
    }
  }
};

function runTests(list, nestLevel = 0) {
  Object.keys(list).forEach(name => {
    if (typeof list[name] === 'function') {
      runTest(name, nestLevel, list[name]);
    } else {
      console.log(Array(nestLevel + 1).join('  ') + name);
      runTests(list[name], nestLevel + 1);
    }
  });
}

function runTest(name, nestLevel, testFn) {
  var padding = Array(nestLevel + 1).join('  ');
  if (testFn.length) {
    testFn(function(isOK) {
      const testResult = isOK ? `${colorGreen}ok` : `${colorRed}fail`;
      const testName = `${name}`;
      console.log(`${padding}${testResult}${colorNormal} - ${testName}`);
    });
  } else {
    const testName = `${name}`;
    const testResult = testFn() ? `  ${colorGreen}ok` : `${colorRed}fail`;
    console.log(`${padding}${testResult}${colorNormal} - ${testName}`);
  }
}

runTests(tests);
