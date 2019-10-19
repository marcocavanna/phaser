import { isValidString } from '@appbuckets/rabbit';
import figures from 'figures';
import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import indentString from 'indent-string';

import { timestampFormatter } from './utils';

class Writer {

  /** Writer Symbols */
  static symbols = {
    hr: process.platform === 'win32' ? '-' : '━'
  }

  /** Writer Icons */
  static icons = {
    /** Blank Icon */
    blank: ' ',

    /** Header with Generation > 0 */
    header: chalk.bold.blue(figures.circle),

    /** Footer with Generation > 0 */
    footer: chalk.bold.blue(figures.circleFilled),

    /** Info message icon */
    info: chalk.blueBright(figures.info),

    /** Success message Tick */
    success: chalk.green(figures.tick),

    /** Warning message Exclamation Mark */
    warning: chalk.bold.yellow('!'),

    /** Error message Exclamation Mark */
    error: chalk.bold.red('!'),

    /** Fatal message Cross icon */
    fatal: chalk.bold.red(figures.cross),

    /** Running message play icon */
    running: chalk.greenBright(figures.play)
  }

  /** Text formatter */
  static text = {
    /** Normal Text */
    normal: text => (text ? chalk.white(text) : ''),

    /** Text Light */
    light: text => (text ? chalk.gray(text) : ''),

    /** Datetime format */
    datetime: text => (text ? chalk.gray(text) : ''),

    /** Header Content */
    mainHeaderContent: text => (text ? chalk.bold.whiteBright(text) : ''),

    /** Header Subheader */
    mainHeaderSubheader: text => (text ? chalk.white(text) : ''),

    /** Header Content for Child */
    headerContent: text => (text ? chalk.whiteBright(text) : ''),

    /** Header Subheader for Child */
    headerSubheader: text => (text ? chalk.gray(text) : ''),

    /** Divisor Color */
    hr: text => (text ? chalk.gray(text) : ''),

    /** Status */
    status: status => (status !== undefined ? chalk.gray(`[${status}]`) : ''),

    /** Elapsed Time */
    elapsedTime: ms => (ms !== undefined ? chalk.magenta(`(${ms}ms)`) : ''),

    /** Info Message */
    info: text => (text ? chalk.blueBright(text) : ''),

    /** Success Message */
    success: text => (text ? chalk.green(text) : ''),

    /** Warning Message */
    warning: text => (text ? chalk.yellow(text) : ''),

    /** Error Message */
    error: text => (text ? chalk.red(text) : ''),

    /** Fatal Message */
    fatal: text => (text ? chalk.bold.bgRed.white(text) : ''),

    /** Running Message */
    running: text => (text ? chalk.white(text) : '')
  }

  /** @type {Number} Single indent Size */
  static indentSize = 2

  /** @type {String} How to Show Time */
  static timeFormat = 'HH.mm.ss.SSS'

  /** @type {String} How to Show Date */
  static dateFormat = ''

  /** @type {Function} Writer to use */
  static writer = global.console.log

  /** @type {Number} Line length */
  static lineLength = 120

  static date = timestampFormatter(Writer.dateFormat)

  static time = timestampFormatter(Writer.timeFormat)

  static styledHeader = (content, subheader) => [
    /** Append a Blank Line */
    ' ',
    /** Append Datetime */
    Writer.text.datetime([
      Writer.date(),
      Writer.time()
    ].filter(isValidString).join(' ')),
    /** Append the Header Content */
    Writer.text.mainHeaderContent(content),
    /** Append the Subheader */
    Writer.text.mainHeaderSubheader(subheader),
    /** Append the Divisor */
    Writer.text.mainHeaderSubheader(Writer.symbols.hr.repeat(Writer.lineLength))
  ].filter(isValidString)


  /** Initialize a Writer using Generation index */
  constructor(generation = 0, transporter = Writer.writer) {
    /** Save the Transporter Function */
    this._transporter = transporter;
    /** Save generation */
    this.generation = generation;
    /** Save the Indent */
    this.indent = generation * Writer.indentSize;
  }


  /** Write a formatted message using Writer transporter */
  write(
    _content,
    // eslint-disable-next-line max-len
    { date = null, time = true, elapsedMs, hr, newLine, wrap = true, textFormatter = Writer.text.normal, icon = Writer.icons.blank, status } = {}
  ) {

    /** Build the Date and Time String */
    const datetime = [
      /** Prepend the Date */
      Writer.date(date).padStart(Writer.dateFormat.length),
      /** Prepend the Time */
      Writer.time(time).padStart(Writer.dateFormat.length)
    ].filter(isValidString).join(' ');

    /** Build main message content, formatting and wrapping */
    const contentLines = wrapAnsi(textFormatter(_content), wrap ? Writer.lineLength : Infinity).split('\n');

    /** Get Base Indent */
    const { indent: firstLineIndent } = this;
    const fromSecondLineIndent = firstLineIndent + (datetime.length ? datetime.length + 4 : 0);

    /** Map Content Lines */
    const content = contentLines
      .map((line, lineIndex) => {
        /**
         * If is the first line of content
         * must append the datetime string,
         * the icon, the status and the elapsed
         * time in ms if exists
         */
        if (lineIndex === 0) {
          /** Return the first line of the content adding features */
          return [

            /** Prepend Datetime if exists */
            isValidString(datetime) ? `${Writer.text.datetime(datetime)} ` : '',

            /** Add the Line Content, adding the Icon and indent */
            indentString([icon, line].filter(isValidString).join(' '), firstLineIndent),

            /** Append Status and Elapsed Time if Exists */
            [
              /** Format Status */
              Writer.text.status(status),
              Writer.text.elapsedTime(elapsedMs)
            ].filter(isValidString).join(' ')

          ].filter(isValidString).join(' ');
        }

        /** Else, simply indent the string */
        return indentString(line, fromSecondLineIndent);
      });

    /** If must, add the HR divisor */
    if (hr) {
      /** Decide hr position */
      const _hrInsertFunction = hr === 'above' ? 'unshift' : 'push';
      /** Add the Divisor */
      content[_hrInsertFunction](Writer.text.hr(indentString(
        Writer.symbols.hr
          .repeat(Writer.lineLength - fromSecondLineIndent + 3), fromSecondLineIndent - 3
      )));
    }

    /** If must, add a new Line */
    if (newLine) {
      switch (newLine) {
        case 'above':
          content.unshift(' ');
          break;

        case 'booth':
          content.unshift(' ');
          content.push(' ');
          break;

        default:
          content.push(' ');
      }
    }

    /** Write the Content */
    this._transporter(content.join('\n'));

  }


  /** Write an Header */
  header(content, subheader) {
    /** If this is the first generation, header must full size and styled */
    if (this.generation === 0) {
      this._transporter(Writer.styledHeader(content, subheader).join('\n'));
      return;
    }

    /** Else, use the writer to build the header */
    this.write([
      Writer.text.headerContent(content),
      Writer.text.headerSubheader(subheader)
    ].filter(isValidString).join(Writer.text.headerSubheader(' - ')), {
      icon    : Writer.icons.header,
      hr      : 'below'
    });
  }

  /** Write a Footer */
  footer(content, description) {
    /** If this is the main footer must be styled */
    if (this.generation === 0) {
      this._transporter(Writer.styledHeader(content, description).reverse().join('\n'));
      return;
    }

    /** Else, use the writer to build the footer */
    this.write([
      Writer.text.headerContent(content),
      Writer.text.headerSubheader(description)
    ].filter(isValidString).join('\n'), {
      icon    : Writer.icons.footer,
      hr      : 'above',
      newLine : 'below'
    });
  }

  /** Build the Log Functions */
  log = this.write

  info = (message, options) => this.write(message, {
    color : Writer.text.info,
    icon  : Writer.icons.info,
    ...options
  })

  success = (message, options) => this.write(message, {
    color : Writer.text.success,
    icon  : Writer.icons.success,
    ...options
  })

  warning = (message, options) => this.write(message, {
    color : Writer.text.warning,
    icon  : Writer.icons.warning,
    ...options
  })

  error = (message, options) => this.write(message, {
    color : Writer.text.error,
    icon  : Writer.icons.error,
    ...options
  })

  fatal = (message, options) => this.write(message, {
    color : Writer.text.fatal,
    icon  : Writer.icons.fatal,
    ...options
  })

  running = (message, options) => this.write(message, {
    color : Writer.text.running,
    icon  : Writer.icons.running,
    ...options
  })


}

export default Writer;
