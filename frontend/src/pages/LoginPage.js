import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AspectRatio,
  Image,
  PasswordInput,
  TextInput,
  Box,
  Stack,
  Button,
  Space,
  Center,
  useMantineTheme,
  MediaQuery,
  Header,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import logo from "../images/logo.png";
import "../styles/LoginPage.css";
import { isValidUsername } from "../helpers/validation";
import { signIn } from "../backendhelpers/userHelpers.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, []);

  const loginForm = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        !isValidUsername(value)
          ? "Invalid username. Only digits and lowercase letters are allowed"
          : null,
      password: (value) => (value === "" ? "Invalid password" : null),
    },
  });

  const handleSignIn = async (values) => {
    try {
      let token = await signIn({
        userName: values.username,
        userPassword: values.password,
      });
      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header
        height={70}
        p='md'
        className='header'
        sx={{ backgroundColor: theme.colors["br-turq"][6] }}
      >
        <Title order={1} color='br-white' ta='left'>
          Bob Ross Together
        </Title>
      </Header>
      <Space h='lg' />
      <AspectRatio ratio={1080 / 1080} sx={{ maxWidth: "200px" }} mx='auto'>
        <Image src={logo} alt='logo' />
      </AspectRatio>
      <Center>
        <Title order={1} color='br-turq'>
          Bob Ross Together
        </Title>
      </Center>
      <Space h='xl' />
      <MediaQuery
        query='(max-width: 500px) and (min-width: 200px)'
        styles={{ paddingLeft: "30px", paddingRight: "30px", height: "100vh" }}
      >
        <Box sx={{ maxWidth: 400 }} mx='auto'>
          <form onSubmit={loginForm.onSubmit((values) => handleSignIn(values))}>
            <TextInput
              withAsterisk
              label='Username'
              placeholder='johnsmith'
              {...loginForm.getInputProps("username")}
            />
            <Space h='lg' />
            <PasswordInput
              withAsterisk
              label='Password'
              placeholder='Password'
              {...loginForm.getInputProps("password")}
            />
            <Space h='xl' />
            <Space h='xl' />
            <Stack spacing='xl'>
              <Button type='submit'>LOGIN</Button>
            </Stack>
          </form>
          <Space h='sm' />
          <Stack spacing='xl'>
            <Button onClick={() => navigate("/signup")}>SIGN UP</Button>
          </Stack>
        </Box>
      </MediaQuery>
    </>
  );
};

export default LoginPage;
