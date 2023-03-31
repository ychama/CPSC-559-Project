import { React, useState, useEffect, useRef } from "react";

const SVGThumbnail = ({ paths, width, height }) => {
  const svgGroupRef = useRef(null);
  const [viewBox, setViewBox] = useState("0 0 500 550");

  useEffect(() => {
    const svgGroup = svgGroupRef.current;
    if (svgGroup) {
      const bbox = svgGroup.getBBox();
      const newViewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
      setViewBox(newViewBox);
    }
  }, [paths]);
  return (
    <>
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
      >
        <g
          id="layer1"
          inkscapelabel="Calque 1"
          inkscapegroupmode="layer"
          ref={svgGroupRef}
        >
          <g id="g3020">
            {paths.map((path, index) => {
              return (
                <path
                  key={index}
                  strokeWidth={path.svgStrokeWidth}
                  strokeMiterlimit={path.svgStrokeMiterLimit}
                  d={path.svgD}
                  stroke="#000000"
                  transform={path.svgTransform}
                  fill={path.svgFill ? path.svgFill : "#FFFFFF"}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </>
  );
};

export default SVGThumbnail;
