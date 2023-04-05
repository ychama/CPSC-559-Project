import fs from "fs";
import xml2js from "xml2js";
import SVG from "./models/svgModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

//SCRIPT TO UPLOAD SVG'S TO THE DATABASE
// NOT USED IN PROJECT CODE, USED FOR TESTING ADDING NEW SVG CANVAS TEMPLATES TO THE DATABASE

dotenv.config({ path: ".env" });
const fileName = "spiderman.svg";
const coloringBookName = "Spider-Man";

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  const svgData = fs.readFileSync(fileName, "utf8");

  // Parse svg
  xml2js.parseString(svgData, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }

    // Get the different attributes from each path
    const pathData = result.svg.path.map((p) => ({
      svgD: p.$.d,
      svgStrokeWidth: p.$["stroke-width"],
      svgStrokeMiterLimit: p.$["stroke-miterlimit"],
      svgStrokeLinecap: p.$["stroke-linecap"],
      svgStrokeLinejoin: p.$["stroke-linejoin"],
      svgTransform: p.$.transform,
      svgFill: "#FFFFFF",
    }));

    // Create svg instance with data
    const svgInstance = new SVG({
      svgName: coloringBookName,
      svgPaths: pathData,
      groupTransform: "",
    });

    // Save the new document to the database
    svgInstance.save(function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Saved document. ");
      }

      // Disconnect from the database
      mongoose.connection.close();
    });
  });
});
