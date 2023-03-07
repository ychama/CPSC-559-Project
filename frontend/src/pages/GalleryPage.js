import React from "react";
import { AppShell, Center } from "@mantine/core";
import Sidebar from "../components/Sidebar";

const GalleryPage = () => {
  return <AppShell navbar={<Sidebar activePage='GALLERY' />}></AppShell>;
};

export default GalleryPage;
