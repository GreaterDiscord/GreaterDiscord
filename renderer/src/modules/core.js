import Logger from "@common/logger";

import Config from "@data/config";
import Changelog from "@data/changelog";

import * as Builtins from "@builtins/builtins";

import LoadingIcon from "../loadingicon";

import LocaleManager from "./localemanager";
import DOMManager from "./dommanager";
import PluginManager from "./pluginmanager";
import ThemeManager from "./thememanager";
import Settings from "./settingsmanager";
import DataStore from "./datastore";
import DiscordModules from "./discordmodules";

import IPC from "./ipc";
import Editor from "./editor";
import Updater from "./updater";

import Styles from "@styles/index.css";

import Modals from "@ui/modals";
import FloatingWindows from "@ui/floatingwindows";


export default new class Core {
    async startup() {
        if (this.hasStarted) return;
        this.hasStarted = true;

        Config.appPath = process.env.DISCORD_APP_PATH;
        Config.userData = process.env.DISCORD_USER_DATA;
        Config.dataPath = process.env.GREATERDISCORD_DATA_PATH;

        IPC.getSystemAccentColor().then(value => DOMManager.injectStyle("gd-os-values", `:root {--os-accent-color: #${value};}`));

        // Load css early
        Logger.log("Startup", "Injecting BD Styles");
        DOMManager.injectStyle("gd-stylesheet", Styles.toString());

        Logger.log("Startup", "Initializing DataStore");
        DataStore.initialize();

        Logger.log("Startup", "Initializing LocaleManager");
        LocaleManager.initialize();

        Logger.log("Startup", "Initializing Settings");
        Settings.initialize();

        Logger.log("Startup", "Initializing DOMManager");
        DOMManager.initialize();

        Logger.log("Startup", "Waiting for connection...");
        await this.waitForConnection();

        Logger.log("Startup", "Initializing Editor");
        await Editor.initialize();

        Modals.initialize();
        FloatingWindows.initialize();

        Logger.log("Startup", "Initializing Builtins");
        for (const module in Builtins) {
            Builtins[module].initialize();
        }

        Logger.log("Startup", "Loading Plugins");
        // const pluginErrors = [];
        const pluginErrors = PluginManager.initialize();

        Logger.log("Startup", "Loading Themes");
        // const themeErrors = [];
        const themeErrors = ThemeManager.initialize();

        Logger.log("Startup", "Initializing Updater");
        Updater.initialize();

        Logger.log("Startup", "Removing Loading Icon");
        LoadingIcon.hide();

        // Show loading errors
        Logger.log("Startup", "Collecting Startup Errors");
        Modals.showAddonErrors({plugins: pluginErrors, themes: themeErrors});

        const previousVersion = DataStore.getBDData("version");
        if (Config.version !== previousVersion) {
            Modals.showChangelogModal(Changelog);
            DataStore.setBDData("version", Config.version);
        }
    }

    waitForConnection() {
        return new Promise(done => {
            if (DiscordModules.UserStore.getCurrentUser()) return done();
            DiscordModules.Dispatcher.subscribe("CONNECTION_OPEN", done);
        });
    }
};
