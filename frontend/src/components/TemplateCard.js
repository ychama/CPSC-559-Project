import React, { useState } from "react";
import {
  Card,
  Text,
  Image,
  Button,
  Modal,
  useMantineTheme,
  TextInput,
  Center,
} from "@mantine/core";
import flower from "../images/flower.png";
import pumpkin from "../images/pumpkin.png";
import brasil from "../images/brasil.png";
import { createWorkspace } from "../backendhelpers/workspaceHelper.js";
import { useNavigate } from "react-router-dom";

const TemplateCard = ({ _id, templateName, paths, groupTransform }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState(false);

  const findImage = () => {
    if (templateName === "pumpkin") {
      return pumpkin;
    } else if (templateName === "flower1") {
      return flower;
    } else return brasil;
  };

  const onNewWorkspace = () => {
    if (!workspaceName) {
      setError(true);
    }
    const req = {
      workspaceName: workspaceName,
      paths: paths,
      groupTransform: groupTransform,
    };

    createWorkspace(req)
      .then((res) => {
        console.log(res);
        localStorage.setItem("workspaceCode", res.workspaceCode);
        navigate("/canvas");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card shadow='sm' p='lg' radius='md' withBorder>
        <Card.Section>
          <Image
            mt='lg'
            src={findImage()}
            height={160}
            alt='Stock Image'
            fit='contain'
          />
        </Card.Section>
        <Text mt='sm' mb='sm' weight={500}>
          Template Name: {templateName}
        </Text>
        <Button
          shadow='sm'
          fullWidth
          disabled={false}
          onClick={() => {
            setOpened(true);
          }}
        >
          Select
        </Button>
      </Card>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Create a Workspace'
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Image
          src={findImage()}
          height={200}
          alt='Stock Image'
          radius='md'
          fit='contain'
        />
        <TextInput
          mt='xl'
          placeholder='Workspace #1'
          label='Workspace Name'
          withAsterisk
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.target.value);
          }}
          error={error}
        />
        <Center mt='xl'>
          <Button onClick={onNewWorkspace}>Create Workspace</Button>
        </Center>
      </Modal>
    </>
  );
};

export default TemplateCard;
