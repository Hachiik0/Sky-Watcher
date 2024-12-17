import React, { useEffect, useState } from "react";
import { useStateContext } from "../Context";
//images
import Clear from "../assets/images/Clear.jpg";
import Fog from "../assets/images/fog.png";
import Cloudy from "../assets/images/Cloudy.jpg";
import Rainy from "../assets/images/Rainy.jpg";
import Snow from "../assets/images/snow.jpg";
import Stormy from "../assets/images/Stormy.jpg";
import Sunny from "../assets/images/Sunny.jpg";

const BackgroundLayout = () => {
  const { weather } = useStateContext();
  const [background, setBackground] = useState(Clear);

  useEffect(() => {
    if (weather.conditions) {
      let imageString = weather.conditions;
      if (imageString.toLowerCase().includes("clear")) {
        setBackground(Clear);
      } else if (imageString.toLowerCase().includes("cloud")) {
        setBackground(Cloudy);
      } else if (
        imageString.toLowerCase().includes("rain") ||
        imageString.toLowerCase().includes("shower")
      ) {
        setBackground(Rainy); // Gunakan video hujan
      } else if (imageString.toLowerCase().includes("snow")) {
        setBackground(Snow);
      } else if (imageString.toLowerCase().includes("fog")) {
        setBackground(Fog);
      } else if (
        imageString.toLowerCase().includes("thunder") ||
        imageString.toLowerCase().includes("storm")
      ) {
        setBackground(Stormy);
      }
    }
  }, [weather]);

  return (
    <div className="h-screen w-full fixed left-0 top-0 -z-[10]">
      {typeof background === "string" ? (
        <img
          src={background}
          alt="background"
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          src={background}
          type="video/mp4"
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

export default BackgroundLayout;
