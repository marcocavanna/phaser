import chalk from 'chalk';
import { will, Deferred } from '@appbuckets/rabbit';
import PQueue from 'p-queue';

import Task from './Task';
import Writer from './Writer';

class Phaser {

  /** @param {Phaser} parent */
  constructor(description, { autoStart = false } = {}, parent) {
    this.running = false;
    this.fatalTask = null;
    this.errorTask = null;
    this.hasError = false;
    this._deferred = new Deferred();

    /** Save Phase Description */
    this.description = description;

    /** Init the Task Container */
    this.tasks = [];
    this._tasksQueue = new PQueue({ concurrency: 1, autoStart });
    this._firstTaskPushed = false;

    /**
     * If this instance of Phaser has
     * been generated from a Phaser
     * instance, save the parent and root
     */
    if (parent instanceof Phaser) {
      this._isRoot = true;
      this._parent = parent;
      this._root = parent._root;
      this._generation = parent._generation + 1;
    }

    /**
     * Else, init new Phaser family
     * using this instance as main parent
     */
    else {
      this._isRoot = true;
      this._root = this;
      this._parent = this;
      this._generation = 0;
    }

    /** Init the Writer */
    this.write = new Writer(this._generation);

    /** Check if must auto start */
    if (autoStart) {
      this.start();
    }
  }

  Child(description, options) {
    return new Phaser(description, options, this);
  }

  get completedTasks() {
    return this.tasks.filter(task => task.isFulfilled);
  }

  get resolvedTasks() {
    return this.tasks.filter(task => task.isResolved);
  }

  get rejectedTasks() {
    return this.tasks.filter(task => task.isRejected);
  }

  get pendingTasks() {
    return this.tasks.filter(task => task.isPending);
  }

  get fatalErrorTasks() {
    return this.tasks.filter(task => task.taskFatal);
  }

  get warningTasks() {
    return this.tasks.filter(task => task.taskWarn);
  }

  get status() {
    const resolvedCount = this.resolvedTasks.length;
    const rejectedCount = this.rejectedTasks.length;
    const warningCount = this.warningTasks.length;

    const resolvedColor = resolvedCount ? 'green' : 'gray';
    const rejectColor = rejectedCount ? 'red' : 'gray';
    const warningColor = warningCount ? 'yellow' : 'gray';

    return [
      `${this.tasks.length} ${this.tasks.length === 1 ? 'Task' : 'Tasks'}`,
      chalk[resolvedColor](`${this.resolvedTasks.length} Resolved`),
      chalk[rejectColor](`${this.rejectedTasks.length} Rejected`),
      chalk[warningColor](`${this.warningTasks.length} Warning`)
    ].join(', ');
  }

  /** @section @name Task */
  task(name, exec, options) {
    /** Get the last task */
    const last = this.tasks[this.tasks.length - 1];
    /** Get if is First Task */
    const isFirst = !this._firstTaskPushed;
    this._firstTaskPushed = true;
    /** Create a new Task */
    const task = new Task(name, exec, { ...options, last, isFirst, generation: this._generation });
    /** Add the Task to task pool */
    this.tasks.push(task);
    /** Add a new Promise to Queue */
    this._tasksQueue.add(() => new Promise(async (resolve) => {
      /** Set if task is last */
      task.isLast = this._tasksQueue.size === 0;
      /** Get Last task Result if exists */
      const lastResult = task.last?.result;
      /** Start the Task, passing this Phaser */
      task.start(this, lastResult);
      /** Await the Task Resolution */
      const [taskError] = await will(task.onIdle());
      /**
       * If a task error occurred
       * must check if it is a fatal error
       * in this case must throw
       * and stop all task execution
       */
      if (taskError) {
        /** Save the Error Task */
        this.errorTask = task;
        /** Save the fatal task if error is fatal */
        this.fatalTask = task.isFatal ? task : null;
        /** Save this is a Phaser Error */
        this.hasError = true;
        /** Report Phaser Error */
        this.error(taskError);
      }

      return resolve();
    }));
    /** Return this instance */
    return this;
  }

  /** Start this Phase */
  start() {
    /** Write the Phase Header */
    this.write.header(this.description);
    /** Save the Start Time */
    this.startOn = Date.now();
    /** Start Promise Queue */
    this._tasksQueue.start();
    /** Set running */
    this.running = true;
    /** Set the onIdle Function */
    this._tasksQueue.onIdle()
      .then(() => {
        /** Render the Phaser Footer */
        this.renderFooter();
        /** PQueue does not reject on error, must check fatal */
        if (this.fatalTask) {
          return this._deferred.reject(this.fatalTask);
        }
        /** If no fatal, resolve */
        return this._deferred.resolve(this.tasks);
      })
      .catch(() => {
        /** Render the Footer */
        this.renderFooter();
        /** Reject the Work */
        return this._deferred.reject(this.tasks);
      });
    /** Return this instance */
    return this;
  }

  /** Fatal error must stop all process */
  error() {
    /** Stop the Task Queue */
    this._tasksQueue.pause();
    /** Clear the Queue */
    this._tasksQueue.clear();
    /** Render the Error, if this is the Phaser error container */
    if (this.hasError) {
      this.errorTask.renderError();
    }
    /** If the error is not fatal show message */
    if (!this.fatalTask) {
      this.write.error('An error occurred in a Phaser Task. All queue will be cleared');
    }
    /** Else if is Fatal, stop all Phaser */
    else {
      /** Show the message */
      this.write.fatal('A Fatal error occured in a Phaser Task. All queue of all Phaser will be cleared');
      /** If this is not the root object stop the parent object */
      if (!this._isRoot) {
        this._parent.error();
      }
    }
  }

  /** */
  waitAllTasks() {
    return this._deferred.promise;
  }

  renderFooter() {
    const end = this.endOn || Date.now();
    const elapsed = end - this.startOn;

    this.write.footer(`${this.description} status after ${elapsed}ms`, this.status);
  }
}

export default Phaser;
