import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  Text,
  Card,
  Image,
  Button,
  useMantineTheme,
  SimpleGrid,
  Badge,
  Group,
} from "@mantine/core";
import { getAllWorkspaces } from "../backendhelpers/workspaceHelper";
import Sidebar from "../components/Sidebar";
import flower from "../images/flower.png";
import pumpkin from "../images/pumpkin.png";
import brasil from "../images/brasil.png";
import SVGThumbnail from "../svgcomponents/SVGThumbnail";
import { setHTTPBackendURL } from "../backendhelpers/proxyHelper";
import { useInterval } from "../helpers/interval";
// HOME PAGE

// This is the page a user sees when they initially log in
// This page has all of the workspaces that a user can join and that have already been created.

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [workspaces, setWorkspaces] = useState([]);

  // Get all the workspaces that have been created (that exist in the backend)
  useEffect(() => {
    // Get them only if the user is logged in with a stored JSON Web Token for authentication
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      getWorkspaces();
    }
    setHTTPBackendURL();
  }, []);

  // Reset Backend HTTP URL every 8 minutes, to ensure the primary replica is being used
  useInterval(setHTTPBackendURL, 480000);

  // Using the workspace code, navigate to the canvas page with the selected workspace to allow a user to work in it.
  const handleJoinCanvas = (code) => {
    localStorage.setItem("workspaceCode", code);
    navigate("/canvas");
  };

  // Function to get all workspaces using the backend helper
  const getWorkspaces = async () => {
    try {
      // Get the workspaces and set them in the component State variables to be displayed to the user
      let res = await getAllWorkspaces();
      setWorkspaces(res.existingWorkspaces.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  // Return the page which includes a sidebar and a grid of all workspaces a user can join.
  // Each component of the grid will have a thumbnail image of the coloring book (snapshot of last edited state) and owner information
  return (
    <AppShell navbar={<Sidebar activePage='HOME' />}>
      <SimpleGrid cols={3} m='lg'>
        {workspaces.map((workspace, index) => (
          <Card key={index} shadow='sm' p='lg' radius='md' withBorder>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <SVGThumbnail paths={workspace.paths} width={100} height={110} />
            </div>
            <Group>
              <Text mt='sm' weight={500}>
                {workspace.workspaceName}
              </Text>
              <Badge mt='sm' color='br-green' variant='filled'>
                Public
              </Badge>
            </Group>
            <Text mb='sm' size='sm' color='dimmed'>
              Creator: {workspace.workspaceOwner}
            </Text>
            <Button
              shadow='sm'
              fullWidth
              disabled={false}
              onClick={() => {
                handleJoinCanvas(workspace.workspaceCode);
              }}
            >
              Join
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </AppShell>
  );
};

export default HomePage;
