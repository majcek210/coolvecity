import env from "./env.js"

function fmt(m: unknown): string {
  if (m instanceof Error) return m.stack ?? m.message;
  return String(m);
}

export default class logger {
  private static format(message: string, prefix?: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}]${prefix ? ` ${prefix}` : ''} ${message}`;
  }
  static log(...messages: unknown[]): void {
    console.log(this.format(messages.map(fmt).join(" ")));
  }

  static warn(...messages: unknown[]): void {
    console.warn(this.format(messages.map(fmt).join(" "), "WARN"));
  }
  static debug(...messages: unknown[]): void {
    if (!env.DEBUG) return;
    console.log(this.format(messages.map(fmt).join(" "), "DEBUG"));
  }

  static error(...messages: unknown[]): void {
    console.error(this.format(messages.map(fmt).join(" "), "ERROR"));
  }

}