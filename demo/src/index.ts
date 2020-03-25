import { System, Scene, world } from '@mint2d/core';

class TestSystem extends System {
   public readonly name = 'test system';

   public update() {
      console.log('Hello, World!');
   }
}

class TestScene extends Scene {
   public readonly name = 'test scene';

   public async createRaw(): Promise<void> {
      this.addSystem(new TestSystem());
   }
}

world.setScene(new TestScene());
