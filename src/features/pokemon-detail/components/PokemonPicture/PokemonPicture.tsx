import { useState } from "react";
import { Loading } from "@shared/ui";
import { cn } from "@shared/lib/utils";
import cardBack from "@shared/assets/pokemon-card-back.svg";

interface Props {
  imageUrl: string | null;
}

function PokemonPicture({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex justify-center">
      {!loaded && <Loading />}
      <img
        className={cn(
          "w-full h-auto max-w-80 transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        alt="Pokemon"
        src={imageUrl ?? cardBack}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = cardBack; }}
      />
    </div>
  );
}

export default PokemonPicture;
