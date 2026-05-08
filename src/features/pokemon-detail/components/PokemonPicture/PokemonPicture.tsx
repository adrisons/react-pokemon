import { useState } from "react";
import { Loading } from "@shared/ui";

interface Props {
  imageUrl: string | null;
}

function PokemonPicture({ imageUrl }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex justify-center">
      {!loaded && <Loading />}
      {imageUrl && (
        <img
          className="w-full h-auto max-w-80"
          alt="Pokemon"
          src={imageUrl}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={!loaded ? { display: "none" } : {}}
        />
      )}
    </div>
  );
}

export default PokemonPicture;
