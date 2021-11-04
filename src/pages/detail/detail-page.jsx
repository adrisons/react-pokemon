import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/badge/badge";
import Loading from "../../components/loading/loading";
import Picture from "../../components/pokemon-picture/pokemon-picture";
import "./detail-page.styles.scss";
function DetailPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loading />;

  function getPokemonImageUrl(pokemon) {
    if (
      !!pokemon.sprites &&
      !!pokemon.sprites.other &&
      !!pokemon.sprites.other["dream_world"]
    ) {
      return pokemon.sprites.other["dream_world"]["front_default"];
    } else {
      return pokemon.sprites["front_default"];
    }
  }

  return (
    <div className="pokemon-detail">
      <h1 className="title">
        <div className="id">#{pokemon.id}</div>
        {pokemon.name}
      </h1>
      <div className="badge-list">
        {pokemon.types.map((e) => (
          <Badge key={e.slot} name={e.type.name} />
        ))}
      </div>
      <div className="moves">{pokemon.moves.length} moves</div>
      <Picture imageUrl={getPokemonImageUrl(pokemon)} />
    </div>
  );
}

export default DetailPage;
