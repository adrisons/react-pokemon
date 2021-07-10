import React from "react";
import typeColors from "../../helpers/type-colors";
import "./badge.styles.scss";

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
