import { System } from './system';
import { Class } from './class';
import { Entity } from './entity';
import { Resource } from './resource';

export abstract class Scene extends Resource {
   private systems: System[] = [];

   public async create(): Promise<void> {
      await super.create();
      await Promise.all(this.systems.map(system => system.create()));
   }

   public addSystem(system: System<object>): void {
      this.systems.push(system);
      system.scene = this;
      system.create();
   }

   private getSystem<S extends System>(clasz: Class<S>): S {
      for (const system of this.systems) {
         if (system instanceof clasz) {
            return system;
         }
      }
      throw new Error(`Failed to get system for ${this.name}`);
   }

   public addComponent<C extends object>(clasz: Class<System<C>>, entity: Entity, component: C): void {
      this.getSystem(clasz).addComponent(entity, component);
   }

   public removeComponent(clasz: Class<System>, entity: Entity): void {
      this.getSystem(clasz).removeComponent(entity);
   }

   public getComponent<C extends object>(clasz: Class<System<C>>, entity: Entity): C {
      return this.getSystem(clasz).getComponent(entity);
   }

   public destroy(): void {
      queueMicrotask(() => {
         const systems = this.systems.slice().reverse();
         this.systems = [];
         for (const system of systems) {
            system.destroy();
         }
      });
      super.destroy();
   }

   public update(): void {
      for (const system of this.systems) {
         system.update();
      }
   }
}
