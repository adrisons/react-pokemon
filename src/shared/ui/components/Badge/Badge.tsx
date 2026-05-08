import type { PokemonTypeName } from "@core/domain/pokemon";
import typeColors from "@shared/constants/typeColors";
import { Badge as ShadcnBadge } from "@shared/ui/components/ui/badge";

interface Props {
  name: PokemonTypeName;
}

function Badge({ name }: Props) {
  const color = typeColors[name];
  return (
    <ShadcnBadge
      variant="outline"
      className="uppercase font-bold tracking-wider rounded-r-xl rounded-l-none text-xs"
      style={{
        borderColor: color,
        borderLeftWidth: "9px",
        borderLeftColor: color,
        color: color,
      }}
    >
      {name}
    </ShadcnBadge>
  );
}

export default Badge;
