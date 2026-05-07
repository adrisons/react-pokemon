import typeColors from "@shared/constants/typeColors";
import "./Badge.css";

function Badge({ name }) {
  return (
    <div
      className="badge"
      style={{
        border: `1px solid ${typeColors[name]}`,
        borderLeft: `9px solid ${typeColors[name]}`,
      }}
    >
      {name}
    </div>
  );
}

export default Badge;
