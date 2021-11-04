import React, { useState } from "react";
import Loading from "../loading/loading";
import "./pokemon-picture.styles.scss";

function Picture({ imageUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="picture-container">
      {!loaded && <Loading />}
      <img
        className="pokemon-picture"
        alt="Pokemon"
        src={imageUrl}
        onLoad={handleImageLoaded}
        style={!loaded ? { display: "none" } : {}}
      ></img>
    </div>
  );

  function handleImageLoaded() {
    setLoaded(true);
  }
}
export default Picture;
