import "./pokemon-picture.styles.scss";

function Picture({ id }) {
  return (
    <div className="picture-container">
      <img
        alt="Pokemon"
        src={`https://pokeres.bastionbot.org/images/pokemon/${id}.png`}
      ></img>
    </div>
  );
}

export default Picture;
