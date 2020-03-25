import { Resource, ResourceState } from './resource';
import { Entity } from './entity';
import { Scene } from './scene';

export abstract class System<C extends object = object> extends Resource {
   private parentScene?: Scene;
   protected components = new Map<Entity, C>();

   public set scene(scene: Scene) {
      this.parentScene = scene;
   }

   public get scene(): Scene {
      if (this.parentScene === undefined) {
         throw new Error(`System ${this.name} has not been added to a scene`);
      }
      return this.parentScene;
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
