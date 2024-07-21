import require from "./polyfill"; // eslint-disable-line no-unused-vars
import secure from "./secure";
import LoadingIcon from "./loadingicon";
import GreaterDiscord from "@modules/core";
import GdApi from "@modules/api/index";

// Perform some setup
secure();
Object.defineProperty(window, "GdApi", {
    value: GdApi,
    writable: false,
    configurable: false
});
Object.defineProperty(window, "BdApi", {
    value: GdApi,
    writable: false,
    configurable: false
});
window.global = window;

// Add loading icon at the bottom right
LoadingIcon.show();
GreaterDiscord.startup();