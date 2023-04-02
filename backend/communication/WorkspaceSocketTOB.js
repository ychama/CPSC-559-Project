import Workspace from "../models/workspaceModel.js";
import { UpdateQueue } from "../util/updateQueue.js";
import { updateClients } from "../communication/ToFrontendSocket.js";
import { broadcastUpdate } from "../communication/ServerToServerSocket.js";
import mongoose from "mongoose";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

// logical timestamps for this object
var TS = Array(otherIds.length + 2).fill(0);

// queue for processing messages
const queue = new UpdateQueue();

async function processClientUpdateMessage(
    targetWorkspaceCode,
    path_id,
    color
) {
    console.log("start processClientUpdateMessage")

    TS[parseInt(localId)] += 1; // increment local timestamp

    const payload = {
        workspaceCode: targetWorkspaceCode,
        path_id: path_id,
        color: color,
    };
    console.log(payload);

    queue.enqueue(parseInt(localId), TS[parseInt(localId)], payload);
    processEnqueuedUpdate();
    await broadcastUpdate(TS[parseInt(localId)], targetWorkspaceCode, path_id, color, false);

    console.log("end processClientUpdateMessage")
}

async function processServerUpdateMessage(
    targetWorkspaceCode,
    path_id,
    color,
    serverId,
    updateTimeStamp,
    isAck
) {
    console.log("start processServerUpdateMessage")

    TS[serverId] = updateTimeStamp;

    const payload = {
        workspaceCode: targetWorkspaceCode,
        path_id: path_id,
        color: color,
    };

    if (!isAck)
        queue.enqueue(serverId, updateTimeStamp, payload);
    processEnqueuedUpdate();

    if (!isAck && updateTimeStamp > TS[parseInt(localId)]) {
        TS[parseInt(localId)] = updateTimeStamp;
        await broadcastUpdate(TS[parseInt(localId)], targetWorkspaceCode, path_id, color, true);
    }

    console.log("end processServerUpdateMessage")
}

function checkServerTimeStamps(updateTimeStamp) {
    // console.log("start checkServerTimeStamps")
    for (let i = 0; i < otherIds.length; i++) {
        if (updateTimeStamp > TS[parseInt(otherIds[i])])
            return false;
    }
    return true;
}

function processEnqueuedUpdate() {
    if (!queue.isEmpty()) {
        const update = queue.front();

        if (checkServerTimeStamps(update.timeStamp)) {
            queue.dequeue();

            const workspaceCode = update.payload.workspaceCode;
            const path_id = update.payload.path_id;
            const color = update.payload.color;

            Workspace.updateOne(
                {
                    workspaceCode: workspaceCode,
                },
                { $set: { "paths.$[element].svgFill": color } },
                { arrayFilters: [{ "element._id": mongoose.Types.ObjectId(path_id) }] },
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        console.log("Error updating Workspace Paths in DB");
                    }
                }
            );

            let data = {
                path_id: path_id,
                color: color,
            };
            updateClients(update.payload.workspaceCode, data);
        }
    }
}

export {
    processClientUpdateMessage,
    processServerUpdateMessage
}