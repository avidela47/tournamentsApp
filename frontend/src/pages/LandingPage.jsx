import React, { useRef, useState, useEffect } from "react";
import videoBg from "../assets/Video de WhatsApp 2025-09-18 a las 21.50.19_f1f6919e.mp4"; // 👈 Cambiá por tu video
import logo from "../assets/logo.png";    // 👈 Cambiá por tu logo

const LandingPage = () => {
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(true);

  const enableSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
    setShowButton(false);
  };

  // 🔑 Bloquea el scroll al cargar la página
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        src={videoBg}
        autoPlay
        loop
        playsInline
        muted
        className="
          object-cover
          w-full h-full
          md:w-[80%] md:h-[80%] md:rounded-2xl md:shadow-lg
        "
      />

      {/* Overlay oscuro */}
      <div
        className="
          absolute 
          bg-black/50 
          w-full h-full
          md:w-[80%] md:h-[80%] md:rounded-2xl
        "
      />

      {/* Botón de activar sonido (arriba derecha, pequeño) */}
      {showButton && (
        <button
          onClick={enableSound}
          className="absolute top-4 right-4 z-20 px-2 py-1 text-xs bg-white/80 text-black rounded-md font-medium shadow-md hover:bg-white transition"
        >
          🔊 Oír
        </button>
      )}

      {/* Contenido */}
      <div className="absolute z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo Super League7"
          className="w-24 h-24 md:w-40 md:h-40 mb-6 object-contain"
        />

        {/* Texto principal con glow rosa */}
        <h1 className="font-anton text-4xl md:text-6xl font-bold uppercase drop-shadow-lg text-white [text-shadow:_0_0_10px_#ff007f,_0_0_20px_#ff007f]">
          Bienvenido a Super League7
        </h1>

        <p className="mt-4 text-lg md:text-2xl drop-shadow-md max-w-2xl">
          El lugar donde viven los torneos, equipos y la pasión del fútbol.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
