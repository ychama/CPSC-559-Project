import "./App.css";
import React, { useState } from "react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CanvasPage from "./pages/CanvasPage";
import CreatePage from "./pages/CreatePage";
import GalleryPage from "./pages/GalleryPage";
import AccountPage from "./pages/AccountPage";
import { useColorScheme } from "@mantine/hooks";

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = (value) => setColorScheme(value);
  return (
    <ColorSchemeProvider
      colorscheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          globalStyles: (theme) => ({
            body: {
              backgroundColor: theme.colors["br-white"][7],
            },
            ".button": {
              ":hover": {
                backgroundColor: theme.colors["br-green"][7],
              },
            },
            ".button-red": {
              ":hover": {
                backgroundColor: "rgb(245, 66, 66, 1)",
              },
            },
          }),
          colors: {
            "br-black": [
              "#FFFFFF",
              "#3A3D3B",
              "#353736",
              "#303331",
              "#2B2E2C",
              "#272A28",
              "#232724",
              "#1F2421",
              "#1C201E",
              "#1A1C1B",
            ],
            "br-blue": [
              "#FFFFFF",
              "#6A8A8B",
              "#5C8282",
              "#4F7A7B",
              "#437474",
              "#386F6F",
              "#2C6B6C",
              "#216869",
              "#245758",
              "#254A4B",
            ],
            "br-turq": [
              "#FFFFFF",
              "#CAD3CF",
              "#B3C4BC",
              "#9EB7AC",
              "#88AE9D",
              "#72A88F",
              "#5AA683",
              "#49A078",
              "#4A886B",
              "#487560",
            ],
            "br-green": [
              "#FFFFFF",
              "#FFFFFF",
              "#FFFFFF",
              "#E8EEE9",
              "#CFDCD0",
              "#B5CFB9",
              "#9CC5A1",
              "#8BB390",
              "#7CA281",
              "#709274",
            ],
            "br-white": [
              "#FFFFFF",
              "#FFFFFF",
              "#FFFFFF",
              "#F4F5F5",
              "#FFFFFF",
              "#FFFFFF",
              "#FFFFFF",
              "#DCE1DE",
              "#C5CCC8",
              "#B1B8B3",
            ],
          },
          primaryColor: "br-turq",
          primaryShade: 7,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="canvas" element={<CanvasPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="create" element={<CreatePage />} />
            <Route path="account" element={<AccountPage />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
