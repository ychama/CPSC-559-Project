import { React, useState, useEffect } from "react";
import { getTemplate } from "../backendhelpers/templateHelpers.js";
import {
  getWorkspace,
  updateWorkspace,
} from "../backendhelpers/workspaceHelper.js";
import { Center, ColorPicker, Stack, TextInput, Title } from "@mantine/core";
import { useInterval } from "../helpers/interval.js";

const WS_URL = 'ws://localhost:5998'; // TODO use effect to get port?

const connectWebsocket = () => {

  const socket = new WebSocket(WS_URL);

    socket.addEventListener('open', (event) => {
      console.log('Connected to the WebSocket server!');
      socket.send(`{ "workspaceCode": "${localStorage.getItem("workspaceCode")}" }`);
    });

    socket.addEventListener('message', (event) => {
      console.log(`Received message: ${event.data}`);
    });

    socket.addEventListener('close', (event) => {
      console.log('Disconnected from the WebSocket server!');
      // TODO error handling
    });

  return socket;
};

const SVG = () => {
  const [SVGPaths, setSVGPaths] = useState([]);
  const [SVGTitleName, setSVGTitleName] = useState("");
  const [groupTransform, setGroupTransform] = useState("");
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const socket = connectWebsocket();

  const updateColor = (index) => {
    
    let newSVGPaths = SVGPaths.slice(0);
    newSVGPaths[index].svgFill = currentColor;
    setSVGPaths(newSVGPaths);

    socket.send(`{ "path": "${newSVGPaths}" }`);

    // updateWorkspace(localStorage.getItem("workspaceCode"), {
    //   paths: newSVGPaths,
    // });
  };

  // TODO convert to web socket
  useEffect(() => {
    // getWorkspace(localStorage.getItem("workspaceCode")).then((result) => {
    //   const workspaceData = result.existingWorkspace;
    //   setSVGTitleName(workspaceData.workspaceName);
    //   setSVGPaths(workspaceData.paths);
    //   setGroupTransform(workspaceData.groupTransform);
    // });
  }, []);

  // TODO convert to web socket
  // Using interval to poll database in 1 second intervals for game updates
  // useInterval(() => {
  //   getWorkspace(localStorage.getItem("workspaceCode")).then((result) => {
  //     const workspaceData = result.existingWorkspace;
  //     setSVGTitleName(workspaceData.workspaceName);
  //     setSVGPaths(workspaceData.paths);
  //     setGroupTransform(workspaceData.groupTransform);
  //   });
  // }, 500);

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
