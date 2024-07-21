import Logger from "@common/logger";

import PluginManager from "@modules/pluginmanager";
import ThemeManager from "@modules/thememanager";
import DiscordModules from "@modules/discordmodules";

import AddonAPI from "./addonapi";
import Data from "./data";
import DOM from "./dom";
import Patcher from "./patcher";
import ReactUtils from "./reactutils";
import UI from "./ui";
import Utils from "./utils";
import Webpack from "./webpack";
import * as Legacy from "./legacy";
import ContextMenu from "./contextmenu";
import fetch from "./fetch";

const bounded = new Map();
const PluginAPI = new AddonAPI(PluginManager);
const ThemeAPI = new AddonAPI(ThemeManager);
const PatcherAPI = new Patcher();
const DataAPI = new Data();
const DOMAPI = new DOM();
const ContextMenuAPI = new ContextMenu();

/**
 * `GdApi` is a globally (`window.GdApi`) accessible object for use by plugins and developers to make their lives easier.
 * @name GdApi
 */
export default class GdApi {
    constructor(pluginName) {
        if (!pluginName) return GdApi;
        if (bounded.has(pluginName)) return bounded.get(pluginName);
        if (typeof(pluginName) !== "string") {
            Logger.error("GdApi", "Plugin name not a string, returning generic API!");
            return GdApi;
        }

        // Re-add legacy functions
        Object.assign(this, Legacy);

        // Bind to pluginName
        this.Patcher = new Patcher(pluginName);
        this.Data = new Data(pluginName);
        this.DOM = new DOM(pluginName);

        bounded.set(pluginName, this);
    }

    // Non-bound namespaces
    get Plugins() {return PluginAPI;}
    get Themes() {return ThemeAPI;}
    get Webpack() {return Webpack;}
    get Utils() {return Utils;}
    get UI() {return UI;}
    get ReactUtils() {return ReactUtils;}
    get ContextMenu() {return ContextMenuAPI;}
    Components = {
        get Tooltip() {return DiscordModules.Tooltip;}
    };
    Net = {fetch}; 
}

// Add legacy functions
Object.assign(GdApi, Legacy);

/**
 * An instance of {@link AddonAPI} to access plugins.
 * @type AddonAPI
 */
GdApi.Plugins = PluginAPI;

/**
 * An instance of {@link AddonAPI} to access themes.
 * @type AddonAPI
 */
GdApi.Themes = ThemeAPI;

/**
 * An instance of {@link Patcher} to monkey patch functions.
 * @type Patcher
 */
GdApi.Patcher = PatcherAPI;

/**
 * An instance of {@link Webpack} to search for modules.
 * @type Webpack
 */
GdApi.Webpack = Webpack;

/**
 * An instance of {@link Data} to manage data.
 * @type Data
 */
 GdApi.Data = DataAPI;

/**
 * An instance of {@link UI} to create interfaces.
 * @type UI
 */
GdApi.UI = UI;

/**
 * An instance of {@link ReactUtils} to work with React.
 * @type ReactUtils
 */
GdApi.ReactUtils = ReactUtils;

/**
 * An instance of {@link Utils} for general utility functions.
 * @type Utils
 */
GdApi.Utils = Utils;

/**
 * An instance of {@link DOM} to interact with the DOM.
 * @type DOM
 */
GdApi.DOM = DOMAPI;

/**
 * An instance of {@link ContextMenu} for interacting with context menus.
 * @type ContextMenu
 */
GdApi.ContextMenu = ContextMenuAPI;

GdApi.Components = {
    get Tooltip() {return DiscordModules.Tooltip;}
};

GdApi.Net = {fetch};

Object.freeze(GdApi);
Object.freeze(GdApi.Net);
Object.freeze(GdApi.prototype);
Object.freeze(GdApi.Components);