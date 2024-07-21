import {contextBridge} from "electron";
import patchDefine from "./patcher";
import newProcess from "./process";
import * as GdApi from "./api";
import init from "./init";

patchDefine();

let hasInitialized = false;
contextBridge.exposeInMainWorld("process", newProcess);
contextBridge.exposeInMainWorld("GreaterDiscordPreload", () => {
    if (hasInitialized) return null;
    hasInitialized = true;
    return GdApi;
});

init();
