import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  AppShell,
  Text,
  Card,
  Image,
  Badge,
  Button,
  Center,
  useMantineTheme,
  SimpleGrid,
} from "@mantine/core";
import { getWorkspace } from "../backendhelpers/workspaceHelper";
import Sidebar from "../components/Sidebar";
import plus from "../images/plus.png";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      getWorkspaces();
    }
  }, []);

  const handleJoinCanvas = (id) => {
    navigate("/work", { state: { canvasID: id } });
  };

  const getWorkspaces = async () => {
    try {
      let res = await getWorkspace({
        token: localStorage.getItem("token"),
      });
      setWorkspaces(res.existingWorkspaces);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppShell navbar={<Sidebar activePage='HOME' />}>
      <SimpleGrid cols={3} m='lg'>
        {workspaces.map((workspace, index) => (
          <Card key={index} shadow='sm' p='lg' radius='md' withBorder>
            <Card.Section>
              <Image
                src='https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
                height={160}
                alt='Stock Image'
              />
            </Card.Section>
            <Text mt='sm' weight={500}>
              {workspace.workspaceName}
            </Text>
            <Text mb='sm' size='sm' color='dimmed'>
              Owner: {workspace.workspaceOwner}
            </Text>
            {/* {canvas.participants < canvas.capacity && (
              <Text mb='sm' size='sm' color='dimmed'>
                {canvas.participants}/{canvas.capacity} artists joined
              </Text>
            )}
            {canvas.participants >= canvas.capacity && (
              <Badge mb='xs' radius='sm' color='orange' variant='filled'>
                Canvas Full
              </Badge>
            )} */}
            <Button
              shadow='sm'
              fullWidth
              disabled={false}
              onClick={() => {
                handleJoinCanvas(124151);
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
