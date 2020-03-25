import { Scene } from './scene';

class DummyScene extends Scene {
   public readonly name = 'dummy scene';

   public destroy(): void {}
}

class World {
   private worldScene: Scene = new DummyScene();
   private loadingScene = this.worldScene;

   public get scene() {
      return this.worldScene;
   }

   constructor() {
      this.update();
   }

   public async setScene(scene: Scene, destroy = true): Promise<void> {
      this.loadingScene = scene;
      await scene.create();

      const oldScene = this.worldScene;
      if (this.loadingScene === scene) {
         this.worldScene = scene;
      }
      if (destroy) {
         oldScene.destroy();
      }
   }

   private update(): void {
      requestAnimationFrame(() => {
         this.worldScene.update();
         this.update();
      });
   }
}

export const world = new World();
