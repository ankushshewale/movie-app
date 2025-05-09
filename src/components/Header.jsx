import React from "react";

function Header() {
  return (
    <header>
      <img
        src="./hero.png"
        alt="A collage of popular movie titles"
        width="512px"
        height="300px"
      />
      <h1>
        Find <span className="text-gradient">Movies</span> You'll Enjoy Without
        the Hassle
      </h1>
    </header>
  );
}

export default Header;
