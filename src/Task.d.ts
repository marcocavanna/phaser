import Writer from './Writer';

export interface ITaskCounter {
  /** Increment the counter, default by 1 */
  increment(by?: number): ITaskCounter
  /** Decrement the counter, default by 1 */
  decrement(by?: number): ITaskCounter
  /** Get/Set actual counter value */
  counter: number
}

export interface ITaskOption {
  /** Last Task */
  last: Task
  /** Generation Count */
  generation: number,
  /** Set if is first Task */
  isFirst: boolean,
  /** Set if is last Task */
  isLast: boolean,
  /** Set if is a silent Task */
  silent: boolean
}

export type TTaskAction = (task: Task) => Promise<any>

class Task {

  constructor(name: string, action: TTaskAction, option: ITaskOption)

  /** Check if a Task is fulfilled */
  readonly isFulfilled: boolean

  /** Check if a Task is resolved */
  readonly isResolved: boolean

  /** Check if a Task is rejected */
  readonly isRejected: boolean

  /** Check if a Task is pending */
  readonly isPending: boolean

  /** Writer interface */
  write: Writer

  /** Task Action */
  action: TTaskAction

  /** This Task name */
  name: string

  /** Previous Task */
  last: Task

  /** Result for this Task */
  result: any

  /** Error for this Task */
  taskError: any

  /** Warn for this Task */
  taskWarn: any

  /** Indicate if task is finished with a fatal error */
  taskFatal: boolean

  /** Task start time */
  startOn: number

  /** Task end time */
  endOn: number

  /** Task elapsed time */
  elapsedTime: number

  /** Indicate if a task is currently running */
  running: boolean

  /** Indicate if a task is silent or not */
  silent: boolean

  /** Indicate if this is the first task of pool */
  isFirst: boolean

  /** Indicate if this is the last task of pool */
  isLast: boolean

  /** Start a Task */
  start(): void

  /** Build a new Counter */
  counter(name: string, initial?: number, state?: 'normal' | 'warning' | 'error' | 'success'): ITaskCounter

  /** Await the task completation */
  onIdle(): Promise<void>

  /** Render the Error to Console */
  renderError(): void

  /** Set the Task as successfully completed */
  complete(result: any): void

  /** Set the Task as completed, but with a warning */
  warning(warn: any): void

  /** Set the Task as Rejected with an error */
  error(err: any): void

  /** Set the Task as Rejected with a fatal error */
  fatal(err: any): void

}

export default Task;
