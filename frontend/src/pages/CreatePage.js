import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, AppShell, Text, Card, SimpleGrid } from "@mantine/core";
import Sidebar from "../components/Sidebar";
import { getAllTemplates } from "../backendhelpers/templateHelpers.js";
import TemplateCard from "../components/TemplateCard";

// CREATE PAGE

// Page that allows a user to create a new workspace from a canvas template
const CreatePage = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  // Upon loading the page, get all of the canvas templates from the backend to display
  useEffect(() => {
    // Verifying that the user is logged in with a JSON web token for authentication
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      getTemplates();
    }
  }, []);

  // Function to get all templates and set them as a State variable in the component to be displayed in the returned DOM elements
  const getTemplates = async () => {
    try {
      // using backend helper to get all templates
      let res = await getAllTemplates();
      console.log(res);
      setTemplates(res.existingTemplates);
    } catch (err) {
      console.log(err);
    }
  };

  // Return the page with the sidebar and grid that has a template card for each canvas template
  return (
    <AppShell navbar={<Sidebar activePage="CREATE" />}>
      <SimpleGrid cols={3} m="lg">
        {templates.map((template, id) => {
          // map each canvas template in the backend to a TemplateCard component that is selectable by users.
          return <TemplateCard key={id} {...template} />;
        })}
      </SimpleGrid>
    </AppShell>
  );
};

export default CreatePage;
