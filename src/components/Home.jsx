import React from "react";
import Cookies from "js-cookie";

const Home = () => {
  console.log(Cookies.get());
  return (
    <div>
      <h1>Home Screen</h1>
    </div>
  );
};

export default Home;
