"use client";
import React from "react";

interface RainbowRingProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function RainbowRing({
  children,
  className = "",
  size = "md",
  animated = true,
}: RainbowRingProps) {
  const sizeClasses = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5",
  };

  const ringSizeClasses = {
    sm: "ring-1",
    md: "ring-2",
    lg: "ring-3",
  };

  return (
    <div
      className={`
        relative rounded-full
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Rainbow ring background with blur */}
      <div
        className={`
          absolute inset-0 rounded-full
          ${ringSizeClasses[size]}
          ${animated ? "animate-pulse" : ""}
        `}
        style={{
          background: `
            conic-gradient(
              from 0deg,
              #ff0000 0deg,
              #ff4000 20deg,
              #ff8000 40deg,
              #ffbf00 60deg,
              #ffff00 80deg,
              #bfff00 100deg,
              #80ff00 120deg,
              #40ff00 140deg,
              #00ff00 160deg,
              #00ff40 180deg,
              #00ff80 200deg,
              #00ffbf 220deg,
              #00ffff 240deg,
              #00bfff 260deg,
              #0080ff 280deg,
              #0040ff 300deg,
              #0000ff 320deg,
              #4000ff 340deg,
              #8000ff 360deg
            )
          `,
          filter: "blur(1px)",
          boxShadow: `
            0 0 20px rgba(255, 0, 255, 0.3),
            0 0 40px rgba(0, 255, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.1)
          `,
        }}
      />
      {/* Inner glassy overlay */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(
              circle at 30% 30%,
              rgba(255, 255, 255, 0.3) 0%,
              rgba(255, 255, 255, 0.1) 30%,
              transparent 70%
            )
          `,
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Content container */}
      <div className="relative flex flex-col items-center z-10 bg-base-100/90 backdrop-blur-sm rounded-full">
        {children}
      </div>

      {/* Animated shimmer effect */}
      {animated && (
        <div
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{
            background: `
              linear-gradient(
                45deg,
                transparent 30%,
                rgba(255, 255, 255, 0.5) 50%,
                transparent 70%
              )
            `,
          }}
        />
      )}
    </div>
  );
}
