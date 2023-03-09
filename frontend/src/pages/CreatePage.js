import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, AppShell, Text, Card, SimpleGrid } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import { getAllTemplates } from "../backendhelpers/templateHelpers.js";
import TemplateCard from "../components/TemplateCard";

const CreatePage = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      getTemplates();
    }
  }, []);

  const getTemplates = async () => {
    try {
      let res = await getAllTemplates();
      console.log(res);
      setTemplates(res.existingTemplates);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppShell navbar={<Sidebar activePage='CREATE' />}>
      <SimpleGrid cols={3} m='lg'>
        {templates.map((template, id) => {
          return <TemplateCard key={id} {...template} />;
        })}
      </SimpleGrid>
    </AppShell>
  );
};

export default CreatePage;
