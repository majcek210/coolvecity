import env from "./env"

function fmt(m: unknown): string {
  if (m instanceof Error) return m.stack ?? m.message;
  return String(m);
}

export default class Logger {
  private static format(message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${message}`;
  }
  static output(...messages: unknown[]): void {
    console.log(this.format(messages.map(fmt).join(" ")));
  }
  static debug(...messages: unknown[]): void {
    if (!env.DEBUG) return;
    console.log(this.format(messages.map(fmt).join(" ")));
  }

}
