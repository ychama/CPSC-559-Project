import { React, useState, useEffect } from "react";
import { getSVG, updateSVG } from "../backendhelpers/svgHelpers.js";
import { Center, ColorPicker, Container, Stack, Text } from "@mantine/core";

const SVG = () => {
  const [SVGPaths, setSVGPaths] = useState([]);
  const [SVGPathName, setSVGPathName] = useState("");
  const [groupTransform, setGroupTransform] = useState("");

  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const updateColor = (index) => {
    let newSVGPaths = SVGPaths.slice(0);
    newSVGPaths[index].svgFill = currentColor;
    setSVGPaths(newSVGPaths);
    updateSVG({ svgName: "flower1", svgPaths: newSVGPaths });
  };

  useEffect(() => {
    getSVG("flower1").then((result) => {
      const SVGData = result.existingSVG;
      setSVGPathName(SVGData.SVGName);
      setSVGPaths(SVGData.svgPaths);
      setGroupTransform(SVGData.groupTransform);
    });
  }, []);

  return (
    // this is the breakdown for the flower image
    // keep the sizing
    <>
      <Stack direction='column' spacing='md'>
        <Container>
          <svg
            width='500.70076'
            height='570.7067066666666'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>Flower Template</title>
            <g
              id='layer1'
              inkscapelabel='Calque 1'
              inkscapegroupmode='layer'
              transform={groupTransform}
            >
              <g id='g3020'>
                {SVGPaths.map((path, index) => {
                  return (
                    <path
                      key={index}
                      strokeWidth={path.svgStrokeWidth}
                      strokeMiterlimit={path.svgStrokeMiterLimit}
                      d={path.svgD}
                      stroke='#000000'
                      transform={path.svgTransform}
                      onClick={() => updateColor(index)}
                      fill={path.svgFill ? path.svgFill : "#FFFFFF"}
                    />
                  );
                })}
              </g>
            </g>
          </svg>
        </Container>
        <Center>
          <ColorPicker
            format='hex'
            value={currentColor}
            onChange={setCurrentColor}
          />
        </Center>
        <Center mt='md'>
          <Text color='br-black'>Current Color: {currentColor}</Text>
        </Center>
      </Stack>
    </>
  );
};

export default SVG;
