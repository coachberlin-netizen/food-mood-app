import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const baseProps = {
  viewBox: "0 0 32 32",
  width: 32,
  height: 32,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const EnergyLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M8 20c4-1 12-1 16 0" />
  </svg>
);

export const EnergyHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M16 4v4M16 24v4M4 16h4M24 16h4m-19.8-8.5l2.8 2.8m10 10l2.8 2.8m-15.6 0l2.8-2.8m10-10l2.8-2.8" />
    <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const SerenityLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 12c6 4 18-4 24 0" />
    <path d="M4 18c6 4 18-4 24 0" opacity="0.4" />
    <path d="M4 24c6 4 18-4 24 0" opacity="0.2" />
  </svg>
);

export const SerenityHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M4 16h24" />
  </svg>
);

export const ClarityLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="10" strokeDasharray="2 4" />
  </svg>
);

export const ClarityHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M16 6l8 10-8 10-8-10z" />
    <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const ConnectionLow = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const ConnectionHigh = (props: IconProps) => (
  <svg {...baseProps} {...props}>
    <path d="M8 8a2 2 0 100 4 2 2 0 000-4zM24 12a2 2 0 100 4 2 2 0 000-4zM12 24a2 2 0 100 4 2 2 0 000-4z" />
    <path d="M10 10l12 4M24 14l-10 12" opacity="0.3" />
  </svg>
);
