import { React, useState, useEffect } from "react";
import { getSVG, updateSVG } from "../backendhelpers/svgHelpers.js";
import {
  Center,
  ColorPicker,
  Container,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useInterval } from "../helpers/interval.js";
const svgName = "flower1";

const SVG = () => {
  const [SVGPaths, setSVGPaths] = useState([]);
  const [SVGTitleName, setSVGTitleName] = useState("");
  const [groupTransform, setGroupTransform] = useState("");

  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const updateColor = (index) => {
    let newSVGPaths = SVGPaths.slice(0);
    newSVGPaths[index].svgFill = currentColor;
    setSVGPaths(newSVGPaths);
    updateSVG({ svgName: svgName, svgPaths: newSVGPaths });
  };

  useEffect(() => {
    getSVG(svgName).then((result) => {
      const SVGData = result.existingSVG;
      setSVGTitleName(SVGData.svgName);
      setSVGPaths(SVGData.svgPaths);
      setGroupTransform(SVGData.groupTransform);
    });
  }, []);

  // Using interval to poll database in 1 second intervals for game updates
  useInterval(() => {
    getSVG(svgName).then((result) => {
      const SVGData = result.existingSVG;
      setSVGTitleName(SVGData.svgName);
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
            {SVGTitleName}
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
        <Center mt='sm'>
          <TextInput
            placeholder='#FFFFFF'
            value={currentColor}
            label='Current color'
            onChange={(e) => setCurrentColor(e.target.value)}
          ></TextInput>
        </Center>
      </Stack>
    </>
  );
};

export default SVG;
