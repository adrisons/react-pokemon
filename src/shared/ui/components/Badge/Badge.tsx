import type { CSSProperties } from "react";
import type { PokemonTypeName } from "@core/domain/pokemon";
import typeColors from "@shared/constants/typeColors";
import { Badge as ShadcnBadge } from "@shared/ui/components/ui/badge";

interface Props {
  name: PokemonTypeName;
  compact?: boolean;
}

function Badge({ name, compact }: Props) {
  return (
    <ShadcnBadge
      variant={compact ? "typeDot" : "type"}
      style={{ "--type-color": typeColors[name] } as CSSProperties}
      data-testid={`type-badge-${name}`}
      aria-label={compact ? name : undefined}
    >
      {compact ? null : name}
    </ShadcnBadge>
  );
}

export default Badge;
