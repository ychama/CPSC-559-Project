import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, AppShell, Text } from "@mantine/core";
import Sidebar from "../components/Sidebar";

const GalleryPage = () => {
  return <AppShell navbar={<Sidebar activePage='CREATE' />}></AppShell>;
};

export default GalleryPage;
