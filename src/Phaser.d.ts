import Task from './Task';
import Writer from './Writer';

export interface IPhaserOptions {
  /** Set if Phaser must auto start */
  autoStart: boolean
}

class Phaser {

  constructor(description: string, options?: IPhaserOptions, parent?: Phaser)

  /** Phaser Description */
  description: string

  /** Task Pool */
  tasks: Task[]

  /** Start Time of this Phase */
  startOn: number

  /** Build a Child Phaser */
  Child(description: string, options?: IPhaserOptions): Phaser

  /** Writer Interface */
  write: Writer

  /** Boolean that indicate if Phaser is Running */
  running: boolean

  /** Check if Phaser has error */
  hasError: boolean

  /** Completed Tasks Array */
  completedTasks: Task[]

  /** Resolved Tasks */
  resolvedTasks: Task[]

  /** Rejected Tasks */
  rejectedTasks: Task[]

  /** Pending Tasks */
  pendingTasks: Task[]

  /** Fatal Error Tasks */
  fatalErrorTasks: Task[]

  /** Warning Tasks */
  warningTasks: Task[]

  /** Create a new Task for this Phaser */
  task(name: string, exec: (task: Task, phaser: this, lastResult: any) => Promise<any>, options?: { silent?: boolean }): this

  /** Start the Phaser */
  start(): this

  /** Set Phaser error */
  error(): void

  /** Wait the resolution of all Tasks */
  waitAllTasks(): Promise<any>

}

class ChildPhaser extends Phaser { }

export default Phaser;
