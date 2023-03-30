import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  userInfo,
  updateUser,
  deleteUser,
} from "../backendhelpers/userHelpers";
import { isValidEmail } from "../helpers/validation";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Text,
  Container,
  useMantineTheme,
  Paper,
  AspectRatio,
  Image,
  TextInput,
  Button,
  Title,
  Center,
  Table,
  PasswordInput,
  Modal,
} from "@mantine/core";
import Sidebar from "../components/Sidebar";
import logo from "../images/logo.png";
const AccountPage = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [updates, setUpdates] = useState({});
  const [edit, setEdit] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [opened, { open, close }] = useDisclosure();
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setUserInfo();
    }
  }, []);

  const setUserInfo = async () => {
    //console.log("Trying to get user information\n");
    let user = await userInfo(localStorage.getItem("userName"));
    //console.log(user);
    setUser(user);
    setUpdates(user);
  };

  const updateUserInfo = async () => {
    delete temp.userName;
    const temp = updates;
    if (temp.userEmail === user.userEmail) {
      delete temp.userEmail;
    }
    let updatedUser = await updateUser(user.userName, temp);
    if (
      updatedUser.userName &&
      updatedUser.userFirstName &&
      updatedUser.userLastName
    ) {
      setUser(updatedUser);
      localStorage.setItem("userName", updatedUser.userName);
    } else if (updatedUser.error === 999) {
      console.log("User Email or UserName already exists!!");
    } else {
      console.log(
        "Update did not go through, response: " + JSON.stringify(updatedUser)
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <AppShell navbar={<Sidebar activePage="HOME" />}>
      <Container>
        <Title order={1} color="br-turq" m="md" align="center">
          Hello, {user.userFirstName}!
        </Title>
        <AspectRatio ratio={1080 / 1080} sx={{ maxWidth: "200px" }} mx="auto">
          <Image src={logo} alt="logo" />
        </AspectRatio>
        <Title order={5} color="black" align="center">
          Thank you for providing us with your creativity and art! Feel free to
          edit any account information below.
        </Title>
        <Paper padding="lg" shadow="xs" m="md">
          <Text align="center" size="xl" weight={700} m="md" pt="md">
            Account Information
          </Text>
          {edit ? (
            <>
              <TextInput
                label="First Name"
                withAsterisk
                m="md"
                value={updates.userFirstName}
                onChange={(event) => {
                  setUpdates({
                    ...updates,
                    ["userFirstName"]: event.currentTarget.value,
                  });
                }}
              />
              <TextInput
                label="Last Name"
                withAsterisk
                m="md"
                value={updates.userLastName}
                onChange={(event) => {
                  setUpdates({
                    ...updates,
                    ["userLastName"]: event.currentTarget.value,
                  });
                }}
              />
              <TextInput
                label="Email"
                error={emailError ? "Invalid Email" : ""}
                withAsterisk
                m="md"
                value={updates.userEmail}
                onChange={(event) => {
                  //console.log(event.currentTarget.value);
                  setEmailError(false);
                  setUpdates({
                    ...updates,
                    ["userEmail"]: event.currentTarget.value,
                  });
                }}
              />
              <PasswordInput
                label="Password"
                m="md"
                placeholder="Please enter your new password here."
                onChange={(event) => {
                  setUpdates({
                    ...updates,
                    ["userPassword"]: event.currentTarget.value,
                  });
                }}
              />
            </>
          ) : (
            <>
              <Center>
                <Table m="md">
                  <tbody align="center">
                    <tr>
                      <td>
                        <b>Username:</b>
                      </td>
                      <td>{user.userName}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>First Name:</b>
                      </td>
                      <td>{user.userFirstName}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Last Name:</b>
                      </td>
                      <td>{user.userLastName}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Email:</b>
                      </td>
                      <td>{user.userEmail}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Password:</b>
                      </td>
                      <td>{"********"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Center>
            </>
          )}
          <Center>
            <Button
              m="md"
              mr="sm"
              onClick={() => {
                if (edit) {
                  if (
                    user.userFirstName === updates.userFirstName &&
                    user.userLastName === updates.userLastName &&
                    updates.userEmail === user.userEmail
                  ) {
                    setEdit(!edit);
                    return;
                  }
                  if (
                    (user.userFirstName !== updates.userFirstName &&
                      updates.userFirstName) ||
                    (user.userLastName !== updates.userLastName &&
                      updates.userLastName) ||
                    updates.userEmail ||
                    updates.userPassword
                  ) {
                    if (!isValidEmail(updates.userEmail)) {
                      setEmailError(true);
                      return;
                    }
                    updateUserInfo();
                  }
                } else {
                  setUpdates(user);
                }
                setEdit(!edit);
              }}
            >
              {edit ? "Save" : "Edit Information"}
            </Button>
            {edit ? (
              <Button ml="sm" m="md" color="red" onClick={() => setEdit(!edit)}>
                Cancel
              </Button>
            ) : (
              <>
                <Modal opened={opened} onClose={close} size="lg">
                  <Title align="center" order={2}>
                    Are you sure you want to delete your account?
                  </Title>
                  <Title align="center" order={4} m="md">
                    {
                      //Workspaces that you own will also be removed.
                    }
                    You may not be able to access your art in the future.
                  </Title>
                  <Center>
                    <Button ml="sm" m="md" color="br-turq" onClick={close}>
                      Cancel
                    </Button>
                    <Button
                      ml="sm"
                      m="md"
                      color="red"
                      onClick={() => {
                        close();
                        deleteUser(user.userName);
                        logout();
                      }}
                    >
                      Delete Account
                    </Button>
                  </Center>
                </Modal>
                <Button ml="sm" m="md" color="red" onClick={open}>
                  Delete Account
                </Button>
              </>
            )}
          </Center>
        </Paper>
      </Container>
    </AppShell>
  );
};

export default AccountPage;
