import pokeball from "@shared/assets/pokeball.png";

const Loading = () => (
  <div className="flex justify-center">
    <img
      src={pokeball}
      alt="Loading…"
      decoding="async"
      className="w-full h-auto max-w-20 motion-safe:animate-spin [animation-duration:4s] [animation-timing-function:linear]"
    />
  </div>
);

export default Loading;
