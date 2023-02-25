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
} from "@mantine/core";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleJoinCanvas = (id) => {
    navigate('/work', { state: { canvasID: id }});
  }

  let cardData = [
    {
      "name": "Thomas' Canvas",
      "canvasID": 124151,
      "participants": 4,
      "capacity": 5,
      "thumbNail": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
    },
    {
      "name": "Yassin's Canvas",
      "canvasID": 5362352,
      "participants": 5,
      "capacity": 5,
      "thumbNail": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
    },
    {
      "name": "Alejo's Canvas",
      "canvasID": 346233,
      "participants": 10,
      "capacity": 2,
      "thumbNail": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
    },
    {
      "name": "Yazan's Canvas",
      "canvasID": 53923,
      "participants": 6,
      "capacity": 7,
      "thumbNail": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
    },
    {
      "name": "Rohit's Canvas",
      "canvasID": 90432,
      "participants": 1,
      "capacity": 100,
      "thumbNail": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
    }
  ]

  return <AppShell navbar={<Sidebar activePage='HOME' />}>
    <Center ml="xl" mt="md" mr="md">
      <Flex 
        justify="flex-start"
        align="flex-start"
        gap="md"
        direction="row"
        wrap="wrap"
      >
        {cardData.map(canvas => (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Card.Section>
              <Image 
                src={canvas.thumbNail}
                height={160}
                alt="Image of {canvas.name}"
              />
            </Card.Section>
            <Text mt="sm" weight={500}>{canvas.name}</Text>
            {canvas.participants < canvas.capacity &&
              <Text mb="sm" size="sm" color="dimmed">
                {canvas.participants}/{canvas.capacity} artists joined
              </Text>
            }
            {canvas.participants >= canvas.capacity &&
              <Badge mb="xs" radius="sm" color='orange' variant="filled">
                Canvas Full
              </Badge>
            }
            <Button 
              shadow="sm" 
              fullWidth 
              disabled={canvas.participants >= canvas.capacity}
              onClick={handleJoinCanvas(canvas.canvasID)}
            >
                Join
            </Button>
          </Card>
        ))}
      </Flex>
    </Center>
  </AppShell>;
};

export default HomePage;
