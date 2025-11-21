import React from "react";

const Logo = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} className={className} />
);

export default Logo;
