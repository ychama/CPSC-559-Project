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
  Group,
  useMantineTheme,
} from "@mantine/core";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const theme = useMantineTheme();

  const testJson =
    '{"canvasName":"Thomas\' Canvas", participants:4, capacity:5, thumbNail:"https://uploads.theartofeducation.edu/flex/lesson_plans/recN3XJX9okThbftu/927253c0" }';

  // var cardInfo = testJson.map(function (canvas) {
  //   return {
  //     canvasName: canvas.canvasName,
  //     participants: canvas.participants,
  //     capacity: canvas.capacity,
  //     thumbNail: canvas.thumbNail,
  //   };
  // });

  let test = [
    {
      canvasName: "Thomas",
      participants: 4,
      capacity: 5,
      thumbNail:
        "https://uploads.theartofeducation.edu/flex/lesson_plans/recN3XJX9okThbftu/927253c0",
    },
  ];

  return (
    <AppShell navbar={<Sidebar activePage='HOME' />}>
      <Flex
        justify='flex-start'
        align='flex-start'
        gap='md'
        direction='row'
        wrap='wrap'
      >
        {test.map((canvas) => (
          <Card shadow='sm' p='lg' radius='md' withBorder>
            <Card.Section>
              <Image
                src={canvas.thumbNail}
                height={160}
                alt='Image of {canvas.canvasName}'
              />
            </Card.Section>

            <Text weight={500}>{canvas.canvasName}</Text>
            <Group position='apart' mt='md' mb='xs'>
              <Text size='sm' color='dimmed'>
                {canvas.participants}/{canvas.capacity} artists joined
              </Text>
              {canvas.participants >= canvas.capacity && (
                <Badge color='br-turq' variant='light'>
                  Canvas Full
                </Badge>
              )}
            </Group>
            <Button disabled={canvas.participants >= canvas.capacity}>
              Join
            </Button>
          </Card>
        ))}
      </Flex>
    </AppShell>
  );
};

export default HomePage;
