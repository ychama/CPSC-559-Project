import { React, useState, useEffect } from "react";
import { Center, ColorPicker, Stack, TextInput, Title } from "@mantine/core";

let websocketUrl = localStorage.getItem("websocketURL");

// Socket for canvas
var socket;

const SVG = () => {
  const [SVGPaths, setSVGPaths] = useState([]);
  const [SVGTitleName, setSVGTitleName] = useState("");
  const [groupTransform, setGroupTransform] = useState("");
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const updateColor = (index) => {
    
    let newSVGPaths = SVGPaths.slice(0);
    newSVGPaths[index].svgFill = currentColor;
    setSVGPaths(newSVGPaths);

    try{
      socket.send(`{ "paths": ${JSON.stringify(SVGPaths)} }`);
    }catch(error){
      console.error(`Could not send color update: ${error}`);
    }
  };

  useEffect(() => {
    websocketUrl = localStorage.getItem("websocketURL");
    socket = new WebSocket(websocketUrl);

    // On connection
    socket.addEventListener('open', (event) => {

      socket.send(`{ "workspaceCode": "${localStorage.getItem("workspaceCode")}" }`);
    });
    
    // On message received
    socket.addEventListener('message', (event) => {

      try {        
        const jsonMsg = JSON.parse(event.data);
  
        if(jsonMsg.hasOwnProperty("workspaceName") &&
            jsonMsg.hasOwnProperty("paths") &&
            jsonMsg.hasOwnProperty("groupTransform")) {
        
          setSVGTitleName(jsonMsg['workspaceName']);
          setSVGPaths(jsonMsg['paths']);
          setGroupTransform(jsonMsg['groupTransform']);
  
        } else if (jsonMsg.hasOwnProperty("paths")) {

          setSVGPaths(jsonMsg['paths']);

        } else {
          throw new Error(`Could not parse websocket update`);
        }
      } catch(error) {
        console.error(`Error receiving message: ${error}`);
      }
    });

    // On disconnect
    socket.addEventListener('close', (event) => {
      console.log('Disconnected from the WebSocket server!');
    });
  }, []);

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
