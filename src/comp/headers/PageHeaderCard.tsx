"use client";

import React from "react";

export type PageHeaderCardProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional right-side content area (e.g. buttons) */
  rightContent?: React.ReactNode;
  /** Optional extra classes for the outer container */
  className?: string;
  /** Optional extra classes for the icon container so pages can customize colors */
  iconContainerClassName?: string;
};

export default function PageHeaderCard({
  icon,
  title,
  description,
  rightContent,
  className = "",
  iconContainerClassName = "border-4 p-3 rounded-2xl text-2xl bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm hover:shadow-md transition-transform hover:scale-105",
}: PageHeaderCardProps) {
  return (
    <div
      className={`flex-1 customContainer flex justify-center items-center p-4 md:p-6 md:mb-4 ${className}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2 md:gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className={iconContainerClassName}>{icon}</div>

          <div className="flex-1 md:w-3/4">
            <h1 className="text-3xl font-bold leading-tight">{title}</h1>
            {description && (
              <p className="text-base-content/60 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>

        {rightContent && (
          <div className="w-full md:w-auto flex md:flex-col justify-center gap-4 md:justify-end">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
