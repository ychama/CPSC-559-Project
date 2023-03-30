import { React, useState, useEffect } from "react";
import { Center, ColorPicker, Stack, TextInput, Title } from "@mantine/core";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";

let websocketUrl = localStorage.getItem("websocketURL");

// Socket for canvas
var socket;

const SVG = () => {
  const [SVGPaths, setSVGPaths] = useState([]);
  const [SVGTitleName, setSVGTitleName] = useState("");
  const [groupTransform, setGroupTransform] = useState("");
  const [currentColor, setCurrentColor] = useState("#FFFFFF");
  const [reconnectToSocket, setReconnectToSocket] = useState(false);

  const updateColor = (pathId) => {
    let newSVGPaths = SVGPaths.slice(0);
    newSVGPaths = newSVGPaths.map((path) => {
      return path._id === pathId ? { ...path, svgFill: currentColor } : path;
    });
    setSVGPaths(newSVGPaths);

    let svgReq = {
      path_id: pathId,
      color: currentColor,
    };

    try {
      socket.send(`{"update_color": ${JSON.stringify(svgReq)}}`);
    } catch (error) {
      console.error(`Could not send color update: ${error}`);
    }

    // try {
    //   socket.send(`{ "paths": ${JSON.stringify(SVGPaths)} }`);
    // } catch (error) {
    //   console.error(`Could not send color update: ${error}`);
    // }
  };

  useEffect(() => {
    // Get new backend URLs on server side failure
    async function getNewUrls() {
      const urls = await getBackendUrl();
      localStorage.setItem("backendURL", urls.serverURL);
      localStorage.setItem("websocketURL", urls.websocketURL);

      console.log("Server urls reset, reconnecting...");

      setReconnectToSocket(!reconnectToSocket); // When this changes we reload the effect
    }

    websocketUrl = localStorage.getItem("websocketURL");
    socket = new WebSocket(websocketUrl);

    // On connection
    const onConnected = () => {
      socket.send(
        `{ "workspaceCode": "${localStorage.getItem("workspaceCode")}" }`
      );
    };
    socket.addEventListener("open", onConnected);

    // On message received
    const onMessageReceived = (event) => {
      try {
        const jsonMsg = JSON.parse(event.data);
        console.log(jsonMsg);

        if (
          jsonMsg.hasOwnProperty("workspaceName") &&
          jsonMsg.hasOwnProperty("paths") &&
          jsonMsg.hasOwnProperty("groupTransform")
        ) {
          setSVGTitleName(jsonMsg["workspaceName"]);
          setSVGPaths(jsonMsg["paths"]);
          // Store in localstorage cause the useState will not be set for updates
          localStorage.setItem("paths", JSON.stringify(jsonMsg["paths"]));
          setGroupTransform(jsonMsg["groupTransform"]);
        } else if (jsonMsg.hasOwnProperty("paths")) {
          setSVGPaths(jsonMsg["paths"]);
        } else if (jsonMsg.hasOwnProperty("update_color")) {
          // Had to retrieve from local storage cause the useState is not set yet
          let tempSVGPaths = [...JSON.parse(localStorage.getItem("paths"))];
          tempSVGPaths = tempSVGPaths.map((path) => {
            if (path._id === jsonMsg["update_color"]["path_id"]) {
              return { ...path, svgFill: jsonMsg["update_color"]["color"] };
            }
            return path;
          });
          console.log(tempSVGPaths);
          localStorage.setItem("paths", JSON.stringify(tempSVGPaths));
          setSVGPaths(tempSVGPaths);
        } else {
          throw new Error(`Could not parse websocket update`);
        }
      } catch (error) {
        console.error(`Error receiving message: ${error}`);
      }
    };
    socket.addEventListener("message", onMessageReceived);

    // On disconnect
    const onDisconnected = () => {
      console.log("Disconnected from the WebSocket server, reconnecting...");
      getNewUrls();
    };
    socket.addEventListener("close", onDisconnected);

    return () => {
      if (socket != null) {
        // unsub from events
        socket.removeEventListener("open", onConnected);
        socket.removeEventListener("message", onMessageReceived);
        socket.removeEventListener("close", onDisconnected);

        // disconnection
        socket.close(1000, `User left workspace`);
        socket = null;
      }
    };
  }, [reconnectToSocket]);

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
                    onClick={() => {
                      updateColor(path._id);
                    }}
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
