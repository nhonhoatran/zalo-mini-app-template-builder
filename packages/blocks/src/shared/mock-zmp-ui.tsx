import React from "react";

export const Box = ({ children, className, style, onClick, ...props }: any) => (
  <div className={className} style={style} onClick={onClick} {...props}>
    {children}
  </div>
);

export const Text = ({ children, className, color, size, bold, ...props }: any) => (
  <span className={className} style={{ fontWeight: bold ? "bold" : "normal" }} {...props}>
    {children}
  </span>
);

Text.Title = ({ children, className, size, ...props }: any) => (
  <h3 className={`font-semibold text-base ${className || ""}`} {...props}>
    {children}
  </h3>
);

export const Button = ({ children, className, onClick, variant, fullWidth, ...props }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium ${
      fullWidth ? "w-full" : ""
    } ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);

export const Icon = ({ icon, className, ...props }: any) => (
  <span className={`inline-block font-mono text-xs ${className || ""}`} {...props}>
    [{icon}]
  </span>
);

export const Input = ({ value, onChange, placeholder, className, ...props }: any) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border rounded-md text-sm ${className || ""}`}
    {...props}
  />
);

export const Swiper = ({ children, autoplay, duration }: any) => (
  <div className="w-full overflow-hidden relative">
    {children}
  </div>
);

Swiper.Slide = ({ children }: any) => (
  <div className="w-full flex-shrink-0">
    {children}
  </div>
);

export default {
  Box,
  Text,
  Button,
  Icon,
  Input,
  Swiper,
};
