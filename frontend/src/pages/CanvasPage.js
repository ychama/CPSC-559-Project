import React from "react";
import { AppShell, Center } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import SVG from "../svgcomponents/SVG.js";

const CanvasPage = () => {
  return (
    <AppShell navbar={<Sidebar activePage='WORK' />}>
      <Center>
        <SVG />
      </Center>
    </AppShell>
  );
};

export default CanvasPage;
