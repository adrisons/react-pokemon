import pokeball from "@shared/assets/pokeball.png";
import "./Loading.css";

const Loading = () => (
  <div className="loading">
    <img src={pokeball} alt="loading" />
  </div>
);

export default Loading;
