import { useState } from "react";
import { Loading } from "@shared/ui";
import "./PokemonPicture.css";

function PokemonPicture({ imageUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="picture-container">
      {!loaded && <Loading />}
      <img
        className="pokemon-picture"
        alt="Pokemon"
        src={imageUrl}
        onLoad={() => setLoaded(true)}
        style={!loaded ? { display: "none" } : {}}
      />
    </div>
  );
}

export default PokemonPicture;
