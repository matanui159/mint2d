interface ContextTypes {
   '2d': CanvasRenderingContext2D;
   webgl: WebGLRenderingContext;
}

export function newRenderContext<S extends keyof ContextTypes>(name: S, canvas = document.createElement('canvas')): ContextTypes[S] {
   const context = canvas.getContext(name);
   if (context === null) {
      throw new Error(`Failed to get context for ${name}`);
   }
   return context as ContextTypes[S];
}

let glContext: WebGLRenderingContext | undefined;
export function getGLContext(): WebGLRenderingContext {
   if (glContext !== undefined) {
      return glContext;
   }

   const canvas = document.querySelector('canvas');
   if (canvas === null) {
      throw new Error('Failed to find canvas');
   }
   glContext = newRenderContext('webgl', canvas);
   return glContext;
}
