interface IWriterSymbols {
  /** Symbol to write a Line on Console */
  hr: '-' | '━'
}

export interface IWriterIcons {
  /** Blank Icon */
  blank: string
  /** Header with Generation > 0 */
  header: string
  /** Footer with Generation > 0 */
  footer: string
  /** Info message icon */
  info: string
  /** Success message Tick */
  success: string
  /** Warning message Exclamation Mark */
  warning: string
  /** Error message Exclamation Mark */
  error: string
  /** Fatal message Cross icon */
  fatal: string
  /** Running message play icon */
  running: string
}

export interface IWriterTextFormatter {
  /** Normal Text */
  normal: (text: string) => string
  /** Text Light */
  light: (text: string) => string
  /** Datetime format */
  datetime: (text: string) => string
  /** Header Content */
  mainHeaderContent: (text: string) => string
  /** Header Subheader */
  mainHeaderSubheader: (text: string) => string
  /** Header Content for Child */
  headerContent: (text: string) => string
  /** Header Subheader for Child */
  headerSubheader: (text: string) => string
  /** Divisor Color */
  hr: (text: string) => string
  /** Status */
  status: (text: string) => string
  /** Elapsed Time */
  elapsedTime: (text: string) => string
  /** Info Message */
  info: (text: string) => string
  /** Success Message */
  success: (text: string) => string
  /** Warning Message */
  warning: (text: string) => string
  /** Error Message */
  error: (text: string) => string
  /** Fatal Message */
  fatal: (text: string) => string
  /** Running Message */
  running: (text: string) => string
}

export interface IWriterOptions {
  /** Set if must prepend date to string */
  date: boolean | number
  /** Set if must prepend time to string */
  time: boolean | number
  /** Elapsed time, it will be formatted */
  elapsedMs: number
  /** Set if must add a divisor at the end of the string */
  hr: 'above' | 'below'
  /** Set if must append or prepend a New line */
  newLine: 'above' | 'below'
  /** Set if text must be wrapped */
  wrap: boolean
  /** Set the Text Formatter function */
  textFormatter: (text: string) => string
  /** Set Message icon */
  icon: string
  /** Set Message Status */
  status: string
}

class Writer {

  /** Set of useful Symbols */
  static symbols: IWriterSymbols

  /** Writer Icons */
  static icons: IWriterIcons

  /** Writer Text Formatters */
  static text: IWriterTextFormatter

  /** The indent size */
  static indentSize: number

  /** The time format to use */
  static timeFormat: string

  /** The date format to use */
  static dateFormat: string

  /** The writer function to use */
  static writer: Function

  /** The maximum line length */
  static lineLength: number

  /** A function to get parsed date using default date format */
  static date: (timestamp: number) => string

  /** A function to get parsed time using default time format */
  static time: (timestamp: number) => string

  /** Build a Styled Header */
  static styledHeader: (content: string, subheader: string) => string[]

  /** Build a new Writer */
  constructor(generation?: number, transporter?: Function)

  write(message: string, options: IWriterOptions): void

  header(content: string, subheader: string): void

  footer(content: string, description: string): void

  log(message: string, options: IWriterOptions): void

  info(message: string, options: IWriterOptions): void

  success(message: string, options: IWriterOptions): void

  warning(message: string, options: IWriterOptions): void

  error(message: string, options: IWriterOptions): void

  fatal(message: string, options: IWriterOptions): void

  running(message: string, options: IWriterOptions): void

}

export default Writer;
