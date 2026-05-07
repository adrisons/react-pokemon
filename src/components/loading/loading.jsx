import React from "react";
import pokeball from "../../assets/pokeball.png";
import "./loading.css";
const Loading = () => {
  return (
    <div className="loading">
      <img src={pokeball} alt="loading" />
    </div>
  );
};

export default Loading;
