export class Lazy<T> {
  private instance: T | undefined = undefined;

  constructor(private readonly factory: () => any) {}

  get (): T {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance as T;
  }
}
