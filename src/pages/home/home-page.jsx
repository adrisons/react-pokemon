import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import Loading from "../../components/loading/loading";
import Pagination from "../../components/pagination/pagination";
import PokemonList from "../../components/pokemon-list/pokemon-list";
import {
  setCurrentPageUrl,
  setSearchResult,
} from "../../redux/pokemons/pokemons.actions";
import {
  selectCurrentPageUrl,
  selectNextPageUrl,
  selectPreviousPageUrl,
} from "../../redux/pokemons/pokemons.selector";
import "./home.styles.scss";

function HomePage({ setCurrentPageUrl, setSearchResult }) {
  const currentPageUrl = useSelector(selectCurrentPageUrl);
  const nextPageUrl = useSelector(selectNextPageUrl);
  const prevPageUrl = useSelector(selectPreviousPageUrl);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(currentPageUrl)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult({
          nextPageUrl: data.next,
          previousPageUrl: data.previous,
        });
        setPokemons(data.results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [currentPageUrl, setSearchResult]);

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

  function updateFilter(event) {
    setFilter(event.target.value);
  }
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
          onChange={updateFilter}
        />
      </div>
      <PokemonList pokemons={pokemons.filter((p) => p.name.includes(filter))} />
      {!filter && (
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentPageUrl: (result) => dispatch(setCurrentPageUrl(result)),
  setSearchResult: (result) => dispatch(setSearchResult(result)),
});

export default connect(null, mapDispatchToProps)(HomePage);
