import React from "react";
const SVG = (props, onClick, fill) => {
  return (
    <path
      strokeWidth={props.svgStrokeWidth}
      strokeMiterlimit={props.svgStrokeMiterLimit}
      d={props.svgD}
      style={props.svgStyle}
      transform={props.svgTransform}
      onClick={() => onClick}
      fill={fill}
    />
  );
};

export default SVG;
