import { React, useState, useEffect } from "react";
import { getSVG, updateSVG } from "../backendhelpers/svgHelpers.js";
import {
  Center,
  ColorPicker,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useInterval } from "../helpers/interval.js";

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

  // Using interval to poll database in 1 second intervals for game updates
  useInterval(() => {
    getSVG("flower1").then((result) => {
      const SVGData = result.existingSVG;
      setSVGPathName(SVGData.SVGName);
      setSVGPaths(SVGData.svgPaths);
      setGroupTransform(SVGData.groupTransform);
    });
  }, 500);

  return (
    // this is the breakdown for the flower image
    // keep the sizing
    <>
      <Stack direction='column' spacing='md'>
        <Center>
          <Title order={1} color='br-turq'>
            Coloring Book #1: Flower
          </Title>
        </Center>
        <svg
          width='500.70076'
          height='550.7067066666666'
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
