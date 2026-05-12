import type { CSSProperties } from "react";
import type { PokemonTypeName } from "@core/domain/pokemon";
import typeColors from "@shared/constants/typeColors";
import { Badge as ShadcnBadge } from "@shared/ui/components/ui/badge";

interface Props {
  name: PokemonTypeName;
}

function Badge({ name }: Props) {
  return (
    <ShadcnBadge
      variant="type"
      style={{ "--type-color": typeColors[name] } as CSSProperties}
      data-testid={`type-badge-${name}`}
    >
      {name}
    </ShadcnBadge>
  );
}

export default Badge;
