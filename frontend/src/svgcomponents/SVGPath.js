import React from "react";
// SVG path component used in the virtual dom to render the SVG's of our application dynamically
// Takes in the required props below, and fills these in as features of the SVG Path. This will correspond to one shape/line/color section of each coloring book SVG
const SVGPath = (props, onClick, fill) => {
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

export default SVGPath;
