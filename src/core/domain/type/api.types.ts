interface RawTypeRelationEntry {
  name: string;
  url: string;
}

export interface RawTypeDamageRelations {
  double_damage_from: RawTypeRelationEntry[];
  double_damage_to: RawTypeRelationEntry[];
  half_damage_from: RawTypeRelationEntry[];
  half_damage_to: RawTypeRelationEntry[];
  no_damage_from: RawTypeRelationEntry[];
  no_damage_to: RawTypeRelationEntry[];
}

export interface RawTypeDetail {
  id: number;
  name: string;
  damage_relations: RawTypeDamageRelations;
}
