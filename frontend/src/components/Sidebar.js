import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mantine/core";
import {
  IconHome2,
  IconChevronRight,
  IconChevronLeft,
  IconBrush,
  IconPhotoSearch,
} from "@tabler/icons";
import "../styles/Sidebar.css";

/**
 * Sidebar for the application
 * @param activePage to set the colour of the active page to black
 * @returns Sidebar
 */
const Sidebar = (props) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(props.activePage);
  const [user, setUser] = useState({});
  const [drawerOpened, setDrawerOpened] = useState(false);

  /**
   * Logs user out of application
   */
  const logout = () => {
    fetch("/user/logout/", {
      method: "POST",
    }).then((response) => {
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    // setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

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
        <Navbar p='xs' className='sidebar'>
          <Navbar.Section>
            <Burger onClick={() => setDrawerOpened((o) => !o)} />
            <Space h='lg' />
            <Center>
              <Title color='white'>Bob Ross Together</Title>
            </Center>
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
                  leftIcon={<IconBrush size={50} />}
                  size='xl'
                  color={activePage === "GALLERY" ? "br-black" : "br-white"}
                  onClick={() => {
                    navigate("/gallery");
                  }}
                  fullWidth
                  className='button'
                >
                  GALLERY
                </Button>
              </>
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
                        {/* {"@" + user.username} */}
                        {"@John"}
                      </Text>
                      <Text color='white' size='xs'>
                        {/* {user.firstName + " " + user.lastName} */}
                        {"John Smith"}
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
                  onClick={() => logout()}
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
