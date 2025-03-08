import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageEffectProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  duration?: number; // Tiempo de transición en milisegundos
  active?: boolean; // Controla si el efecto se activa o no
}

const ImageEffect: React.FC<ImageEffectProps> = ({
  src,
  alt,
  width,
  height,
  duration = 1000,
  active = true,
}) => {
  const [blurred, setBlurred] = useState(active);

  useEffect(() => {
    if (active) {
      const timeout = setTimeout(() => setBlurred(false), duration);
      return () => clearTimeout(timeout);
    } else {
      setBlurred(false);
    }
  }, [active, duration]);

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-[${duration}ms] ${
          blurred ? "blur-md" : "blur-none"
        }`}
      />
    </div>
  );
};

export default ImageEffect;
