import Builtin from "@structs/builtin";

import Strings from "@modules/strings";
import Settings from "@modules/settingsmanager";
import Webpack from "@modules/webpackmodules";

import ContextMenuPatcher from "@modules/api/contextmenu";
import pluginManager from "@modules/pluginmanager";
import themeManager from "@modules/thememanager";
import Utilities from "@modules/utilities";
import React from "@modules/react";


const ContextMenu = new ContextMenuPatcher();
const UserSettingsWindow = Webpack.getByProps("open", "updateAccount");

export default new class BDContextMenu extends Builtin {
    get name() {return "BDContextMenu";}
    get category() {return "general";}
    get id() {return "gdContextMenu";}

    constructor() {
        super(...arguments);
        this.callback = this.callback.bind(this);
    }

    enabled() {
        this.patch = ContextMenu.patch("user-settings-cog", this.callback);
    }

    disabled() {
        this.patch?.();
    }

    callback(retVal) {
        const target = Utilities.findInTree(retVal, b => Array.isArray(b) && b.some(e => e?.key?.toLowerCase() === "my_account"), {walkable: ["props", "children"]});
        if (!target) return;

        // Prevent conflict with plugin until its eradicated
        if (target.some(e => e.props.label.toLowerCase() === "greaterdiscord")) return;

        // GreaterDiscord Settings
        const items = Settings.collections.map(c => this.buildCollectionMenu(c));

        // Updater
        items.push({
            label: Strings.Panels.updates,
            action: () => this.openCategory("updates")
        });

        // Custom CSS
        if (Settings.get("settings", "customcss", "customcss")) {
            items.push({
                label: Strings.Panels.customcss,
                action: () => this.openCategory("customcss")
            });
        }

        // Plugins & Themes
        items.push(this.buildAddonMenu(Strings.Panels.plugins, pluginManager));
        items.push(this.buildAddonMenu(Strings.Panels.themes, themeManager));

        // Parent SubMenu
        const bdSubMenu = ContextMenu.buildItem({type: "submenu", label: "GreaterDiscord", items: items});
        const bdGroup = React.createElement(ContextMenu.Group, null, [bdSubMenu]);
        target.push(bdGroup);
    }

    buildCollectionMenu(collection) {
        return {
            type: "submenu",
            label: collection.name,
            action: () => this.openCategory(collection.name),
            items: collection.settings.map(category => {
                return {
                    type: "submenu",
                    label: category.name,
                    action: () => this.openCategory(collection.name),
                    items: category.settings.filter(s => s.type === "switch" && !s.hidden && s.id !== this.id).map(setting => {
                        return {
                            type: "toggle",
                            label: setting.name,
                            disabled: setting.disabled,
                            active: Settings.get(collection.id, category.id, setting.id),
                            action: () => Settings.set(collection.id, category.id, setting.id, !Settings.get(collection.id, category.id, setting.id))
                        };
                    })
                };
            })
        };
    }

    /**
     * TODO: Can this be done better now that it's integrated?
     * @param {string} label 
     * @param {import("../../modules/addonmanager").default} manager 
     * @returns 
     */
    buildAddonMenu(label, manager) {
        const names = manager.addonList.map(a => a.name || a.getName()).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        return {
            type: "submenu",
            label: label,
            action: () => this.openCategory(label.toLowerCase()),
            items: names.map(name => {
                return {
                    type: "toggle",
                    label: name,
                    disabled: manager.getAddon(name)?.partial ?? false,
                    active: manager.isEnabled(name),
                    action: () => manager.toggleAddon(name)
                };
            })
        };
    }

    async openCategory(id) {
        ContextMenu.close();
        UserSettingsWindow?.open?.(id);
    }
};