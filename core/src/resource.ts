export const enum ResourceState {
   initial,
   created,
   destroyed
}

export abstract class Resource {
   public readonly abstract name: string;
   protected async createRaw(): Promise<void> {};
   protected destroyRaw(): void {};

   private resourceState = ResourceState.initial;
   private createPromise?: Promise<void>;

   public get state(): ResourceState {
      return this.resourceState;
   }

   public async create(): Promise<void> {
      if (this.resourceState === ResourceState.destroyed) {
         throw new Error(`${this.name} already destroyed`);
      }
      if (this.createPromise === undefined) {
         this.createPromise = this.createRaw();
      }
      await this.createPromise;
      this.resourceState = ResourceState.created;
   }

   public destroy(): void {
      if (this.resourceState === ResourceState.initial) {
         throw new Error(`${this.name} not created`);
      }
      if (this.resourceState === ResourceState.destroyed) {
         return;
      }
      this.resourceState = ResourceState.destroyed;
      queueMicrotask(() => this.destroy());
   }
}
