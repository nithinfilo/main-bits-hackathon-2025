"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
  onClick
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 40; // Reduced sensitivity
    const y = (clientY - (rect.top + rect.height / 2)) / 40; // Reduced sensitivity
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={onClick}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
          : "translate3d(0px, 0px, 0)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn(
        "w-full relative rounded-xl overflow-hidden cursor-pointer",
        containerClassName
      )}
    >
      <motion.div
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale(1.02)`
            : "translate3d(0px, 0px, 0) scale(1)",
          transition: "transform 0.1s ease-out",
        }}
        className={cn("h-full w-full", className)}
      >
        <Noise />
        {children}
      </motion.div>
    </motion.div>
  );
};

const Noise = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full opacity-10"
      style={{
        backgroundImage: "url(/noise.webp)",
        backgroundSize: "30%",
      }}
    ></div>
  );
};