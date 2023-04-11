// RECOVERY CONTROLLER
import { getServerCanvasUpdates } from "../communication/WorkspaceSocketTOB.js";

const broadcastCanvasUpdates = () => {
  let serverCanvasUpdate = getServerCanvasUpdates();
};

export { broadcastCanvasUpdates };
