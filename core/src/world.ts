import { Scene } from './scene';

class DummyScene extends Scene {
   public readonly name = 'dummy scene';

   public destroy(): void {}
}

class World {
   private currentScene: Scene = new DummyScene();
   private loadingScene = this.currentScene;

   public get scene() {
      return this.currentScene;
   }

   public constructor() {
      this.update();
   }

   public async setScene(scene: Scene, destroy = true): Promise<void> {
      this.loadingScene = scene;
      await scene.create();

      const oldScene = this.currentScene;
      if (this.loadingScene === scene) {
         this.currentScene = scene;
      }
      if (destroy) {
         oldScene.destroy();
      }
   }

   private update(): void {
      requestAnimationFrame(() => {
         this.currentScene.update();
         this.update();
      });
   }
}

export const world = new World();
