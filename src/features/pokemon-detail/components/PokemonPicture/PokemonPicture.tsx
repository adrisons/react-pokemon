import { useState } from "react";
import { Loading } from "@shared/ui";
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
        className="w-full h-auto max-w-80"
        alt="Pokemon"
        src={imageUrl ?? cardBack}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = cardBack; }}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}

export default PokemonPicture;
