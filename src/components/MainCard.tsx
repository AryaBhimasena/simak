"use client";

import React from "react";

interface MainCardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function MainCard({
  title,
  subtitle,
  headerAction,
  children,
  className = "",
  fullWidth = false,
  loading = false,
}: MainCardProps) {
  return (
    <div
      className={`simakMainCard ${
        fullWidth ? "simakMainCard--full" : ""
      } ${className}`}
    >
      {(title || headerAction) && (
        <div className="simakMainCard__header">
          <div>
            {title && (
              <h2 className="simakMainCard__title">{title}</h2>
            )}
            {subtitle && (
              <p className="simakMainCard__subtitle">{subtitle}</p>
            )}
          </div>

          {headerAction && (
            <div className="simakMainCard__action">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className="simakMainCard__body">
        {loading ? (
          <div className="simakMainCard__loading">
            <div className="simakMainCard__spinner" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
