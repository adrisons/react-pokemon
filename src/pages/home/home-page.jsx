import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setLoading(true);
    fetch(currentPageUrl)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        setPokemon(data.results);
      });
  }, [currentPageUrl]);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return "Loading...";

  return (
    <>
      <div className="pokemon-list">
        <PokemonList pokemons={pokemon} />
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      </div>
    </>
  );
}

export default HomePage;
