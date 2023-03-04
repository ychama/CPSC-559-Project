import fs from "fs";
import xml2js from "xml2js";
const fileToUpdate = "./spiderman.svg";
const svgFile = fs.readFileSync(fileToUpdate, "utf-8");

xml2js.parseString(svgFile, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  const originalPath = result.svg.path[0].$;

  const pathArray = splitPath(originalPath.d);

  const newPaths = pathArray.map((pathData) => ({
    $: {
      d: pathData,
      "stroke-width": originalPath["stroke-width"],
      "stroke-miterlimit": originalPath["stroke-miterlimit"],
      "stroke-linecap": originalPath["stroke-linecap"],
      "stroke-linejoin": originalPath["stroke-linejoin"],
      transform: originalPath.transform,
      fill: "#FFFFFF",
      stroke: "#000000",
    },
  }));

  result.svg.path = newPaths;

  const builder = new xml2js.Builder();
  const modifiedSvg = builder.buildObject(result);

  fs.writeFileSync(fileToUpdate, modifiedSvg);
});

function splitPath(path) {
  const splitPaths = path.split(/[M]/).filter((p) => p.trim() !== "");
  return splitPaths.map((p) => `M${p}`);
}
