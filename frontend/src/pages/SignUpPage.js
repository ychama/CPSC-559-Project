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
import { isValidEmail, isValidUsername } from "../helpers/validation";
import { signUp } from "../backendhelpers/userHelpers.js";
import { setHTTPBackendURL } from "../backendhelpers/proxyHelper";
import { useInterval } from "../helpers/interval";
// SIGN UP PAGE

// Page that allows a user to sign up to an account

const SignUpPage = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    setHTTPBackendURL();
  }, []);
  // Reset Backend HTTP URL every 8 minutes, to ensure the primary replica is being used
  useInterval(setHTTPBackendURL, 480000);
  // Function used for the page's sign up form. This function uses the built in Mantine form function "useForm"
  const signUpForm = useForm({
    initialValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    // Validate the values in the form
    validate: {
      username: (value) =>
        !isValidUsername(value)
          ? "Invalid username. Only digits and lowercase letters are allowed"
          : null,
      email: (value) => (!isValidEmail(value) ? "Invalid email format" : null),
      firstName: (value) => (value === "" ? "Invalid first name" : null),
      lastName: (value) => (value === "" ? "Invalid last name" : null),
      password: (value) => (value === "" ? "Invalid password" : null),
    },
  });

  // Function to handle user sign up
  // This function will make a request to the backend using the backend helper "signUp" and attempt to sign a new user up into the application
  const handleSignUp = async (values) => {
    try {
      // Send a request to the backend using a helper
      let token = await signUp({
        userName: values.username,
        userEmail: values.email,
        userFirstName: values.firstName,
        userLastName: values.lastName,
        userPassword: values.password,
      });
      // Upon success, update the local storage variables for the username and JSON Web Token for authentication of future requests.
      localStorage.setItem("token", token);
      localStorage.setItem("userName", values.username);
      // Go to the home page
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  // Return the sign up page. This uses built in Mantine Components and the functions above to implement the functionality of the signup page
  return (
    <>
      <Header
        height={70}
        p="md"
        className="header"
        sx={{ backgroundColor: theme.colors["br-turq"][6] }}
      >
        <Title order={1} color="br-white" ta="left">
          Bob Ross Together
        </Title>
      </Header>
      <Space h="lg" />
      <AspectRatio ratio={1080 / 1080} sx={{ maxWidth: "200px" }} mx="auto">
        <Image src={logo} alt="logo" />
      </AspectRatio>
      <Center>
        <Title order={1} color="br-turq">
          Bob Ross Together
        </Title>
      </Center>
      <Space h="xl" />
      <MediaQuery
        query="(max-width: 500px) and (min-width: 200px)"
        styles={{ paddingLeft: "30px", paddingRight: "30px", height: "100vh" }}
      >
        <Box sx={{ maxWidth: 400 }} mx="auto">
          <form
            onSubmit={signUpForm.onSubmit((values) => handleSignUp(values))}
          >
            <TextInput
              withAsterisk
              label="Username"
              placeholder="johnsmith"
              {...signUpForm.getInputProps("username")}
            />
            <Space h="lg" />
            <TextInput
              withAsterisk
              label="Email"
              placeholder="JohnSmith@gmail.com"
              {...signUpForm.getInputProps("email")}
            />
            <Space h="lg" />
            <TextInput
              withAsterisk
              label="First Name"
              placeholder="John"
              {...signUpForm.getInputProps("firstName")}
            />
            <Space h="lg" />
            <TextInput
              withAsterisk
              label="Last Name"
              placeholder="Smith"
              {...signUpForm.getInputProps("lastName")}
            />
            <Space h="lg" />
            <PasswordInput
              withAsterisk
              label="Password"
              placeholder="Password"
              {...signUpForm.getInputProps("password")}
            />
            <Space h="xl" />
            <Space h="xl" />
            <Stack spacing="xl">
              <Button type="submit">Create New User</Button>
            </Stack>
            <Space h="sm" />
            <Stack spacing="xl">
              <Button onClick={() => navigate("/")}>Back</Button>
            </Stack>
          </form>
        </Box>
      </MediaQuery>
    </>
  );
};

export default SignUpPage;
