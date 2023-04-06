import React from "react";
import { ActionIcon, AppShell, Center } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import SVG from "../svgcomponents/SVG.js";
import { IconArrowLeft } from "@tabler/icons";
import { useNavigate } from "react-router-dom";

// CANVAS PAGE

// This is the page where users will make simultaneous edits to the SVG being displayed.
// The SVG component is used in this page and displayed in the center of the screen
// The SVG component handles user input and requests that are to be sent to the backend.

const CanvasPage = () => {
  const navigate = useNavigate();

  return (
    <AppShell
      navbar={
        <ActionIcon
          variant="transparent"
          sz="xl"
          onClick={() => navigate("/home")}
          mt="sm"
          ml="sm"
        >
          <IconArrowLeft size={34} />
        </ActionIcon>
      }
    >
      <Center>
        <SVG />
      </Center>
    </AppShell>
  );
};

export default CanvasPage;
