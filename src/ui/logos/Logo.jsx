import React from "react";

const Logo = ({ src, alt, width = "100%", height = "100%" }) => (
  <img src={src} alt={alt} width={width} height={height} className="" />
);

export default Logo;
