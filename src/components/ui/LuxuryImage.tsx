"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";

interface LuxuryImageProps extends Omit<ImageProps, "onLoad"> {
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
  hoverZoom?: boolean;
  roundedCorners?: boolean;
  shadow?: boolean;
  reveal?: boolean;
}

export const LuxuryImage: React.FC<LuxuryImageProps> = ({
  src,
  alt,
  aspectRatio = "auto",
  hoverZoom = true,
  roundedCorners = false,
  shadow = true,
  reveal = true,
  className = "",
  fill,
  sizes,
  priority,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  // Aspect Ratio calculations
  let ratioClass = "relative overflow-hidden w-full h-full ";
  if (!fill) {
    if (aspectRatio === "square") {
      ratioClass += "aspect-square ";
    } else if (aspectRatio === "portrait") {
      ratioClass += "aspect-[3/4] ";
    } else if (aspectRatio === "landscape") {
      ratioClass += "aspect-[16/9] ";
    }
  }

  // Formatting styling classes
  let imgContainerClass = "relative overflow-hidden w-full ";
  if (roundedCorners) {
    imgContainerClass += "rounded-sm ";
  }
  if (shadow) {
    imgContainerClass += "shadow-card ";
  }

  return (
    <div className={`${imgContainerClass} ${className}`}>
      <motion.div
        className={ratioClass}
        initial={reveal ? { opacity: 0 } : {}}
        animate={reveal ? { opacity: loaded ? 1 : 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="w-full h-full relative"
          whileHover={hoverZoom ? { scale: 1.05 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={src}
            alt={alt}
            fill={fill !== undefined ? fill : true}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            loading={priority ? undefined : "lazy"}
            priority={priority}
            {...props}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
