import React from "react";

interface CosmicThemeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "light" | "dark";
}

const CosmicTheme: React.FC<CosmicThemeProps> = ({
  children,
  className = "",
  variant = "default",
}) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case "light":
        return "bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100";
      case "dark":
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
      default:
        return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900";
    }
  };

  const getStarColor = () => {
    switch (variant) {
      case "light":
        return "bg-purple-400";
      case "dark":
        return "bg-yellow-300";
      default:
        return "bg-yellow-300";
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${getBackgroundStyle()} ${className}`}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large stars */}
        <div
          className={`absolute top-20 left-1/4 w-2 h-2 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className={`absolute top-32 right-1/3 w-1.5 h-1.5 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-16 left-2/3 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Medium stars */}
        <div
          className={`absolute top-48 left-1/6 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className={`absolute top-64 right-1/4 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className={`absolute top-80 left-3/4 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Small stars */}
        <div
          className={`absolute top-96 left-1/3 w-0.5 h-0.5 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className={`absolute top-[28rem] right-1/6 w-0.5 h-0.5 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className={`absolute top-[32rem] left-1/2 w-0.5 h-0.5 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "0.3s" }}
        ></div>

        {/* Additional star layers */}
        <div
          className={`absolute top-[36rem] left-1/8 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className={`absolute top-[40rem] right-1/3 w-0.5 h-0.5 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className={`absolute top-[44rem] left-5/6 w-1 h-1 ${getStarColor()} rounded-full animate-pulse`}
          style={{ animationDelay: "0.7s" }}
        ></div>
      </div>

      {/* Nebula effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "5s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CosmicTheme;



