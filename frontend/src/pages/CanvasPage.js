import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  AppShell,
  Text,
  Container,
  Image,
  Center,
  ColorPicker,
} from "@mantine/core";
import Sidebar from "../components/Sidebar";
import SVG from "../svgcomponents/SVG.js";

const CanvasPage = () => {
  const [fillColors, setFillColors] = useState(Array(22).fill("#FFFFFF"));
  const [currentColor, setCurrentColor] = useState("#FFFFFF");

  const onFillColor = (i) => {
    let newFillColors = fillColors.slice(0);
    newFillColors[i] = currentColor;
    setFillColors(newFillColors);
  };

  return (
    <AppShell navbar={<Sidebar activePage="WORK" />}>
      <Center>
        <SVG fillColors={fillColors} onFill={onFillColor} />
        <ColorPicker
          format="hex"
          value={currentColor}
          onChange={setCurrentColor}
        />
      </Center>
    </AppShell>
  );
};

export default CanvasPage;
