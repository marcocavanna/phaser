import { Deferred, isValidString } from '@appbuckets/rabbit';
import chalk from 'chalk';
import PrettyError from 'pretty-error';

import Writer from './Writer';

class Task {

  static stateColorMap = {
    normal  : 'gray',
    warning : 'yellow',
    error   : 'red',
    success : 'green'
  }

  /** @param {Phaser} phaser */
  constructor(name, action, { last, generation, silent, isFirst, isLast } = {}) {

    /** Save the Params */
    this.name = name;
    this.last = last;
    this.action = action;
    this.silent = !!silent;
    this.isFirst = !!isFirst;
    this.isLast = !!isLast;

    /** Add a Deferred Object */
    this._deferred = new Deferred();

    /** Set up Counter */
    this.counters = {};

    /** Create the Writer */
    this.write = new Writer(generation);

    /** Init result / error container */
    this.result = null;
    this.taskError = null;
    this.taskWarn = null;
    this.isFatal = false;

    this.pe = new PrettyError();

  }

  /** Start Task */
  start(...args) {
    /** Set the Start Time */
    this.startOn = Date.now();
    /** Show Task Running, only if not Silent */
    if (!this.silent) {
      this.write.running(this.name);
    }
    /** Execute the task action */
    try {
      this.action.bind(this.action)(this, ...args);
    }
    catch (e) {
      this.fatal(e);
    }
    /** Set task as running */
    this.running = true;
  }

  /**
   * Init a series of getter to
   * check the current task status
   */
  get isFulfilled() {
    return this._deferred.isFulfilled;
  }

  get isResolved() {
    return this._deferred.isResolved;
  }

  get isRejected() {
    return this._deferred.isRejected;
  }

  get isPending() {
    return this._deferred.isPending;
  }

  /**
   * Counters are key of the object
   * counter that will be initialized
   * as number. The counter function
   * return a set of utility to change
   * the counter. That counter will be
   * returned while generating status
   */
  counter(name, initial = 0, state = 'normal') {
    const self = this;

    /** Create the Counter if doesn't exists */
    if (!this.counters[name]) {
      this.counters[name] = { count: initial, state };
    }

    /** Return the Counter Manager */
    return {
      increment(by = 1) {
        self.counters[name].count += by;
        return this;
      },

      decrement(by = 1) {
        self.counters[name].count -= by;
        return this;
      },

      get counter() {
        return self.counters[name].count;
      },

      set counter(num) {
        self.counters[name].count = num;
      }
    };
  }

  /**
   * This function return the deferred
   * promise of this task that will be
   * fulfilled by completed function
   */
  onIdle() {
    return this._deferred.promise;
  }

  renderError() {
    this.write.write(this.pe.render(this.taskError));
  }

  renderCounter() {
    /** Get Counters */
    return Object
      .getOwnPropertyNames(this.counters)
      .map((name) => {
        const { count, state } = this.counters[name];
        const color = count ? Task.stateColorMap[state] : 'gray';
        return chalk[color](`${count} ${name}`);
      })
      .join(chalk.grey(', '));
  }

  stop({ callback, status, writeFn, options } = {}) {
    /** Save Stop time */
    this.endOn = Date.now();
    /** Save the Elapsed Time */
    this.elapsed = this.endOn - this.startOn;
    /** Stop running */
    this.running = false;
    /** Write Task Log, only if not silent */
    if (!this.silent) {
      /** Build the Content */
      const content = [
        this.name,
        Object.getOwnPropertyNames(this.counters).length && this.renderCounter()
      ].filter(isValidString).join('\n');
      /** Write the content using writing function */
      this.write[writeFn](content, {
        status,
        elapsedMs : this.elapsed,
        newLine   : !this.isLast ? 'below' : false,
        ...options
      });
    }
    /** Execute the Callback */
    callback();
  }

  /** Resolve the current task */
  complete = result => this.stop({
    callback: () => {
      /** Save the Task Result */
      this.result = result;
      return this._deferred.resolve(result);
    },
    status  : 'Complete',
    writeFn : 'success'
  });

  /** Resolve task but with a warn */
  warning = (warn = true) => this.stop({
    callback: () => {
      /** Save warning */
      this.taskWarn = warn;
      return this._deferred.resolve(warn);
    },
    status  : 'Warning',
    writeFn : 'warning'
  })

  /** Reject the current task */
  error = (err = new Error('Generic Error')) => this.stop({
    callback: () => {
      /** Save the Error */
      this.taskError = err;
      return this._deferred.reject(err);
    },
    status  : 'Error',
    writeFn : 'error'
  })

  /** Set this task as fatal */
  fatal = (err = new Error('Generic Error')) => this.stop({
    callback: () => {
      /** Save the Error */
      this.taskError = err;
      this.isFatal = true;
      return this._deferred.reject(err);
    },
    status  : 'Fatal',
    writeFn : 'fatal'
  })

}

export default Task;
