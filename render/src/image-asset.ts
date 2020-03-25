import { Resource } from '@mint2d/core';
import { newRenderContext } from './context';

export class ImageAsset extends Resource {
   private static render?: CanvasRenderingContext2D;

   private blob?: Blob;
   private imageWidth = 0;
   private imageHeight = 0;
   private imageData?: ImageData;

   public get width(): number {
      return this.imageWidth;
   }

   public get height(): number {
      return this.imageHeight;
   }

   public get data(): ImageData {
      if (this.imageData === undefined) {
         throw new Error('Image not created');
      }
      return this.imageData;
   }

   public constructor(public readonly name: string, blob: Blob) {
      super();
      this.blob = blob;
   }

   public async createRaw(): Promise<void> {
      const image = new Image();
      await new Promise((resolve, reject) => {
         image.onload = resolve;
         image.onerror = reject;
         image.src = URL.createObjectURL(this.blob);
      });
      URL.revokeObjectURL(image.src);
      delete this.blob;

      this.imageWidth = image.width;
      this.imageHeight = image.height;
      const width = this.imageWidth + 2;
      const height = this.imageHeight + 2;
      if (ImageAsset.render === undefined) {
         ImageAsset.render = newRenderContext('2d');
      }
      ImageAsset.render.canvas.width = width;
      ImageAsset.render.canvas.height = height;
      ImageAsset.render.drawImage(image, 1, 1);
      this.imageData = ImageAsset.render.getImageData(0, 0, width, height);
   }
}
