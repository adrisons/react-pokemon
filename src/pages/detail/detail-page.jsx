import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../components/badge/badge";
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

  if (loading) return "Loading...";

  return (
    <>
      <div className="pokemon-detail">
        <h1 className="title">
          <div className="id">#{pokemon.id}</div>
          {pokemon.name}
        </h1>
        <div className="badge-list">
          {pokemon.types.map((e) => (
            <Badge name={e.type.name} />
          ))}
        </div>
      </div>
    </>
  );
}

export default DetailPage;
