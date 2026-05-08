import pokeball from "@shared/assets/pokeball.png";

const Loading = () => (
  <div className="flex justify-center">
    <img
      src={pokeball}
      alt="loading"
      decoding="async"
      className="w-full h-auto max-w-20 animate-spin"
      style={{ animationDuration: "4000ms", animationTimingFunction: "linear" }}
    />
  </div>
);

export default Loading;
