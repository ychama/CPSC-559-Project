import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, AppShell, Text } from "@mantine/core";
import Sidebar from "../components/Sidebar";

const CanvasPage = () => {
  return <AppShell navbar={<Sidebar activePage='WORK' />}></AppShell>;
};

export default CanvasPage;
