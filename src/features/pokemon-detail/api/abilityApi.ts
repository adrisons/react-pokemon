import { get } from "@core/api";

interface RawAbilityEffect {
  short_effect: string;
  language: { name: string };
}

interface RawAbility {
  effect_entries: RawAbilityEffect[];
}

export async function getAbilityDescription(name: string): Promise<string> {
  const data = await get<RawAbility>(`/ability/${name}`);
  const entry = data.effect_entries.find((e) => e.language.name === "en");
  return entry?.short_effect ?? "";
}
