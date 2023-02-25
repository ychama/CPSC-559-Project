import React from "react";
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
