import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../backendhelpers/userHelpers";
import {
  Text,
  Navbar,
  Button,
  Title,
  Avatar,
  Group,
  useMantineTheme,
  Box,
  UnstyledButton,
  Space,
  Drawer,
  Burger,
  Center,
  AspectRatio,
  Image,
} from "@mantine/core";
import {
  IconHome2,
  IconChevronRight,
  IconChevronLeft,
  IconBrush,
  IconPhotoSearch,
} from "@tabler/icons";
import "../styles/Sidebar.css";
import logo from "../images/logo.png";

/**
 * Sidebar for the application, Component is reused in several pages when the user is logged in.
 * @param activePage to set the colour of the active page to black
 * @returns Sidebar
 */
const Sidebar = (props) => {
  // Required state variables and Mantine theme
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(props.activePage);
  const [user, setUser] = useState({});
  const [drawerOpened, setDrawerOpened] = useState(false);

  /**
   * Logs user out of application
   */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Gets the user name with the userName local storage variable and updates the sidebar component information
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setUserInfo();
    }
  }, []);

  // Sets the user information by sending a request to retrieve the information from the backend
  const setUserInfo = async () => {
    let user = await userInfo(localStorage.getItem("userName"));
    setUser(user);
  };

  // Return the react component using built in Mantine components in the sidebar
  // This corresponds to the sidebar visible on a screen when you are logged in. From here, users can navigate, log out, etc...
  return (
    <>
      <Burger
        className='burger'
        color={theme.colors["br-black"][7]}
        opened={drawerOpened}
        onClick={() => setDrawerOpened((open) => !open)}
      />
      <Drawer
        opened={drawerOpened}
        withCloseButton={false}
        onClose={() => setDrawerOpened((o) => !o)}
      >
        <Navbar p='xs'>
          <Navbar.Section>
            <Burger onClick={() => setDrawerOpened((o) => !o)} />
            <Space h='lg' />
          </Navbar.Section>
          <Navbar.Section>
            <AspectRatio
              ratio={1080 / 1080}
              sx={{ maxWidth: "150px" }}
              mx='auto'
            >
              <Image src={logo} alt='logo' />
            </AspectRatio>
            <Center>
              <Title color='white' order={2}>
                Bob Ross
              </Title>
            </Center>
            <Center>
              <Title color='white' order={1}>
                Together
              </Title>
            </Center>
            <Space h='lg' />
          </Navbar.Section>
          <Navbar.Section grow mt='md'>
            {!user.isAdmin ? ( // only render the button if user.isAdmin is false
              <Button
                variant='subtle'
                leftIcon={<IconHome2 size={50} />}
                size='xl'
                color={activePage === "HOME" ? "br-black" : "br-white"}
                onClick={() => {
                  navigate("/home");
                }}
                fullWidth
                className='button'
              >
                HOME
              </Button>
            ) : null}
            {!user.isAdmin ? (
              <>
                <Space h='xl' />
                <Button
                  variant='subtle'
                  leftIcon={<IconPhotoSearch size={50} />}
                  size='xl'
                  color={activePage === "CREATE" ? "br-black" : "br-white"}
                  onClick={() => {
                    navigate("/create");
                  }}
                  fullWidth
                  className='button'
                >
                  CREATE
                </Button>
              </>
            ) : null}
          </Navbar.Section>
          <Navbar.Section>
            <Box
              sx={{
                paddingTop: theme.spacing.sm,
              }}
            >
              {!user.isAdmin ? (
                <UnstyledButton
                  sx={{
                    display: "block",
                    width: "100%",
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color: theme.black,
                    backgroundColor:
                      activePage === "ACCOUNT"
                        ? theme.colors["br-green"][7]
                        : "",

                    "&:hover": {
                      backgroundColor: theme.colors["br-green"][7],
                    },
                  }}
                  onClick={() => {
                    navigate("/account");
                  }}
                >
                  <Group>
                    <Avatar radius='xl' />
                    <Box sx={{ flex: 1 }}>
                      <Text size='sm' weight={500}>
                        {"@" + user.userName}
                      </Text>
                      <Text color='white' size='xs'>
                        {user.userFirstName + " " + user.userLastName}
                      </Text>
                    </Box>

                    {theme.dir === "ltr" ? (
                      <IconChevronRight size={18} />
                    ) : (
                      <IconChevronLeft size={18} />
                    )}
                  </Group>
                </UnstyledButton>
              ) : null}
              <Space h='sm' />
              <Center>
                <Button
                  sx={{
                    flex: 1,
                    backgroundColor: "rgb(245, 66, 66, 0.8)",
                    color: "white",
                  }}
                  onClick={() => {
                    logout();
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("workspaceCode");
                    localStorage.removeItem("userName");
                    localStorage.removeItem("paths");
                  }}
                  className='button-red'
                >
                  Logout
                </Button>
              </Center>
            </Box>
          </Navbar.Section>
        </Navbar>
      </Drawer>
    </>
  );
};

export default Sidebar;
