import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const baseProps = {
  viewBox: "0 0 32 32",
  width: 32,
  height: 32,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const EnergyLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="8" />
    <path d="M12 14c1 1.5 3 2.5 8 1" />
  </svg>
);

export const EnergyHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="6" />
    <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2" />
  </svg>
);

export const SerenityLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M6 10c4-2 8 2 12-2s8 2 12-2M2 18c4 2 8-2 12 2s8-2 12 2M6 26c4-2 8 2 12-2s8 2 12-2" />
  </svg>
);

export const SerenityHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 16c6-1 18-1 24 0" />
  </svg>
);

export const ClarityLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="8" />
    <path d="M14 14h.01M18 14h.01M16 18h.01M13 18h.01M19 18h.01" />
  </svg>
);

export const ClarityHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M16 4l10 12-10 12L6 16z" />
  </svg>
);

export const ConnectionLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const ConnectionHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
    <circle cx="22" cy="14" r="2" fill="currentColor" stroke="none" />
    <circle cx="14" cy="24" r="2" fill="currentColor" stroke="none" />
    <path d="M10 10l12 4M22 14l-8 10M14 24L10 10" strokeWidth="1" opacity="0.6" />
  </svg>
);
