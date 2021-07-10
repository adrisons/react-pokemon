import React from "react";
import pokeball from "../../assets/pokeball.png";
import "./loading.scss";
const Loading = () => {
  return (
    <div className="loading">
      <img src={pokeball} alt="loading" />
    </div>
  );
};

export default Loading;
