export class Store {
  private localStorageKey: string;
  private internalStore: Map<string, string>;

  constructor(localStorageKey: string) {
    this.localStorageKey = localStorageKey;
    this.internalStore = new Map(
      Object.entries(
        JSON.parse(window.localStorage.getItem(this.localStorageKey) ?? "{}")
      )
    );
  }

  get internalJSON() {
    return JSON.stringify(Object.fromEntries(this.internalStore.entries()));
  }

  setItem(key: string, value: string) {
    this.internalStore.set(key, value);
    window.localStorage.setItem(this.localStorageKey, this.internalJSON);
  }

  getItem<T>(key: string): T {
    return JSON.parse(this.internalStore.get(key) ?? "{}");
  }

  deleteItem(key: string) {
    this.internalStore.delete(key);
    window.localStorage.setItem(this.localStorageKey, this.internalJSON);
  }

  clearItems() {
    this.internalStore.clear();
    window.localStorage.removeItem(this.localStorageKey);
  }

  entries() {
    return this.internalStore.entries();
  }

  keys() {
    return this.internalStore.keys();
  }

  values() {
    return this.internalStore.values();
  }
}
