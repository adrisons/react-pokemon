import type { PokemonTypeName } from "@core/domain/pokemon";
import typeColors from "@shared/constants/typeColors";

interface Props {
  name: PokemonTypeName;
}

function Badge({ name }: Props) {
  return (
    <div
      className="px-2 py-1 text-xs uppercase font-bold rounded-r-xl tracking-wider"
      style={{
        border: `1px solid ${typeColors[name]}`,
        borderLeft: `9px solid ${typeColors[name]}`,
      }}
    >
      {name}
    </div>
  );
}

export default Badge;
