import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stack, AppShell, Text } from "@mantine/core";
import Sidebar from "../components/Sidebar";

const templates = [
  {
    id: 1,
    svgName: "Template 1",
    svgPaths: [
      {
        id: "path",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(4.171,0,0,4.171,-1189.9,-1622.6)",
        svgFill: "#41d14f",
      },
      {
        id: "path1",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(1.9267,-3.6993,3.6993,1.9267,-2300.4,940)",
        svgFill: "#41d14f",
      },
      {
        id: "path2",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(-2.2819,-3.4915,3.4915,-2.2819,-619.15,3078.5)",
        svgFill: "#41d14f",
      },
      {
        id: "path3",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(-4.168 .15789 -.15789 -4.168 2006.7 2709.8)",
        svgFill: "#41d14f",
      },
      {
        id: "path4",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(1.8201,3.7529,-3.7529,1.8201,1664.3,-1785.7)",
        svgFill: "#41d14f",
      },
      {
        id: "path5",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m393.15 488.97c0 14.938-8.8643 27.047-19.799 27.047s-19.799-12.109-19.799-27.047 8.8643-27.047 19.799-27.047 19.799 12.109 19.799 27.047z",
        svgTransform: "matrix(-2.1332,3.5842,-3.5842,-2.1332,3051.5,358.96)",
        svgFill: "#41d14f",
      },
      {
        id: "path6",
        svgStrokeWidth: "0.39355",
        svgStrokeMiterLimit: "2",
        svgD: "m388.2 491.45c0 7.7128-6.2525 13.965-13.965 13.965-7.7129 0-13.965-6.2525-13.965-13.965 0-7.7129 6.2525-13.965 13.965-13.965 7.7128 0 13.965 6.2525 13.965 13.965z",
        svgTransform: "matrix(7.6546,0,0,7.6546,-2501.9,-3188.1)",
        svgFill: "#ffe500",
      },
    ],
    groupTransform: "translate(-119.87 -303.28)",
  },
];

const GalleryPage = () => {
  return <AppShell navbar={<Sidebar activePage='CREATE' />}></AppShell>;
};

export default GalleryPage;
