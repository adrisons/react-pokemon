import React, { useEffect, useState } from "react";
import Loading from "../../components/loading/loading";
import Pagination from "../../components/pagination/pagination";
import PokemonList from "../../components/pokemon-list/pokemon-list";
import "./home.styles.scss";

function HomePage() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(currentPageUrl)
      .then((res) => res.json())
      .then((data) => {
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        setPokemon(data.results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [currentPageUrl]);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="pokemon-list">
        <div className="center">Couldn't find pokemons.</div>
        <div className="center">
          You can use candy to attract them or check your internet connection.
        </div>
      </div>
    );

  return (
    <div className="pokemon-list">
      <div className="center">
        <input
          className="filter-input"
          id="filter"
          name="filter"
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <PokemonList pokemons={pokemon.filter((p) => p.name.includes(filter))} />
      {!filter && (
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      )}
    </div>
  );
}

export default HomePage;
