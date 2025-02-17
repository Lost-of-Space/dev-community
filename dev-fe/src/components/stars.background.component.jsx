import { useEffect, useState } from "react";

const FallingStars = ({ symbols = ["★", "✦"], chance = [0.6, 0.4], starSize = 18, glowing = false }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const createStar = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 100 + "vw";
      const size = Math.random() * starSize + "px";
      const duration = Math.random() * 3 + 2 + "s";

      // getting random star type
      const starTypes = symbols;
      const weights = chance;
      let rand = Math.random();
      let cumulative = 0;
      let starSymbol = "★";

      for (let i = 0; i < starTypes.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) {
          starSymbol = starTypes[i];
          break;
        }
      }

      const star = { id, left, size, duration, symbol: starSymbol };

      setStars((prev) => [...prev, star]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, 5000);
    };

    const interval = setInterval(createStar, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className={"star absolute top-0 text-white " + (glowing ? "glow" : "")}
          style={{
            left: star.left,
            fontSize: star.size,
            animation: `fall ${star.duration} linear forwards`,
          }}
        >
          {star.symbol}
        </div>
      ))}

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(90vh) rotate(360deg); opacity: 0; }
          }

          .glow {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6);
          }
        `}
      </style>
    </div>
  );
};

export default FallingStars;