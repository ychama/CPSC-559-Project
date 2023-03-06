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

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getWorkspaces();
    }
  }, []);

  const handleJoinCanvas = (id) => {
    navigate("/work", { state: { canvasID: id } });
  };

  let cardData = [
    {
      name: "Thomas' Canvas",
      canvasID: 124151,
      participants: 4,
      capacity: 5,
      thumbNail:
        "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
    },
  ];

  const getWorkspaces = async () => {
    try {
      let workspaces = await getWorkspace({
        token: localStorage.getItem("token"),
      });
      console.log(workspaces);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppShell navbar={<Sidebar activePage='HOME' />}>
      <SimpleGrid cols={3} m='lg'>
        {cardData.map((canvas) => (
          <Card shadow='sm' p='lg' radius='md' withBorder>
            <Card.Section>
              <Image
                src={canvas.thumbNail}
                height={160}
                alt='Image of {canvas.name}'
              />
            </Card.Section>
            <Text mt='sm' weight={500}>
              {canvas.name}
            </Text>
            {canvas.participants < canvas.capacity && (
              <Text mb='sm' size='sm' color='dimmed'>
                {canvas.participants}/{canvas.capacity} artists joined
              </Text>
            )}
            {canvas.participants >= canvas.capacity && (
              <Badge mb='xs' radius='sm' color='orange' variant='filled'>
                Canvas Full
              </Badge>
            )}
            <Button
              shadow='sm'
              fullWidth
              disabled={canvas.participants >= canvas.capacity}
              onClick={() => {
                handleJoinCanvas(canvas.canvasID);
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
