import { Resource, ResourceState } from './resource';
import { Entity } from './entity';
import { Scene } from './scene';

export abstract class System<C extends object = object> extends Resource {
   private systemScene?: Scene;
   protected components = new Map<Entity, C>();

   public set scene(scene: Scene) {
      this.systemScene = scene;
   }

   public get scene(): Scene {
      if (this.systemScene === undefined) {
         throw new Error(`Failed to get parent scene for ${this.name}`);
      }
      return this.systemScene;
   }

   public addComponent(entity: Entity, component: C): void {
      this.removeComponent(entity);
      this.components.set(entity, component);
   }

   public removeComponent(entity: Entity): void {
      this.components.delete(entity);
   }

   public getComponent(entity: Entity): C {
      const component = this.components.get(entity);
      if (component === undefined) {
         throw Error(`Failed to get component for ${this.name}`);
      }
      return component;
   }

   public destroy(): void {
      queueMicrotask(() => {
         for (const entity of this.components.keys()) {
            this.removeComponent(entity);
         }
      });
      super.destroy();
   }

   public update(): void {}
}
