const entityName = 'entity';
export type Entity = symbol & { description: typeof entityName };

export function newEntity(): Entity {
   return Symbol(entityName) as Entity;
}
