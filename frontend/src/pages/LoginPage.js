import React, { useEffect, useState } from "react";
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
import { setHTTPBackendURL } from "../backendhelpers/proxyHelper";
import { useInterval } from "../helpers/interval";

// LOGIN PAGE

// Login page/Landing page that allows a user to log into the application.
// After login validation, a user may use the app's functionality

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  // Check if there is a JSON Web Token in local storage and log the user in automatically if there is
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
    setHTTPBackendURL();
  }, []);

  // Reset Backend HTTP URL every 8 minutes, to ensure the primary replica is being used
  useInterval(setHTTPBackendURL, 480000);

  // Function for the login form using the Mantine form function "useForm"
  // We validate the username before logging the user in
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

  // Function to handle user log in
  // This will send a request to the backend using the backend helper "signIn"
  const handleSignIn = async (values) => {
    try {
      // Try to log the user in and receive the JSON Web Token response for authentication
      let token = await signIn({
        userName: values.username,
        userPassword: values.password,
      });
      // Update local storage variables and navigate to the home page, successful user login
      localStorage.setItem("token", token);
      localStorage.setItem("userName", values.username);
      navigate("/home");
    } catch (err) {
      // Check status for invalid username/password codes to notify the user
      if (err.response.status === 402) {
        loginForm.setErrors({ username: "Invalid username" });
      }
      if (err.response.status === 405) {
        loginForm.setErrors({ password: "Invalid password" });
      }
    }
  };

  // Return the page with the form for log in, this uses built in Mantine components and the functions above for the login page logic
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
