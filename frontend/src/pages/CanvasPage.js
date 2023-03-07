import React from "react";
import { AppShell, Center } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import SVG from "../svgcomponents/SVG.js";

/*

TODO: Set up code for websocket connection when the user opens the canvas page with the coloring book

const socket = new WebSocket('http://localhost:5001/');

socket.addEventListener('open', (event) => {
  console.log('Connected to the WebSocket server!');
});

socket.addEventListener('message', (event) => {
  console.log(`Received message: ${event.data}`);
});

socket.addEventListener('close', (event) => {
  console.log('Disconnected from the WebSocket server!');
});

Use this to send JSON data to the server:   socket.send(JSON.stringify(message));
This will be transmitted to all clients connected to the wss

*/

const CanvasPage = () => {
  return (
    <AppShell navbar={<Sidebar activePage='HOME' />}>
      <Center>
        <SVG />
      </Center>
    </AppShell>
  );
};

export default CanvasPage;
