import React from "@modules/react";
import Strings from "@modules/strings";
import Utilities from "@modules/utilities";
import Events from "@modules/emitter";
import Settings from "@modules/settingsmanager";
import DataStore from "@modules/datastore";
import WebpackModules, {Filters} from "@modules/webpackmodules";
import Patcher from "@modules/patcher";
import DiscordModules from "@modules/discordmodules";

import ReactUtils from "@modules/api/reactutils";

import Button from "@ui/base/button";
import Modals from "@ui/modals";

import AddonList from "@ui/settings/addonlist";
import SettingsGroup from "@ui/settings/group";
import SettingsTitle from "@ui/settings/title";
import Header from "@ui/settings/sidebarheader";

import Restore from "./icons/restore";
// import SettingsPanel from "./settings/panel";


function makeResetButton(collectionId, refresh) {
    const action = confirmReset(() => {
        Settings.resetCollection(collectionId);
        refresh?.();
    });
    return <DiscordModules.Tooltip color="primary" position="top" text={Strings.Settings.resetSettings}>
                {(props) =>
                    <Button {...props} size={Button.Sizes.ICON} look={Button.Looks.BLANK} color={Button.Colors.TRANSPARENT} onClick={action}>
                        <Restore />
                    </Button>
                }
            </DiscordModules.Tooltip>;
}

/**
 * @param {function} action
 * @returns 
 */
function confirmReset(action) {
    return () => {
        Modals.showConfirmationModal(Strings.Modals.confirmAction, Strings.Settings.resetSettingsWarning, {
            confirmText: Strings.Modals.okay,
            cancelText: Strings.Modals.cancel,
            danger: true,
            onConfirm: action,
        });
    };
}

export default new class SettingsRenderer {

    constructor() {
        this.patchSections();
        Events.on("strings-updated", this.forceUpdate);
    }

    onDrawerToggle(collection, group, state) {
        const drawerStates = DataStore.getBDData("drawerStates") || {};
        if (!drawerStates[collection]) drawerStates[collection] = {};
        drawerStates[collection][group] = state;
        DataStore.setBDData("drawerStates", drawerStates);
    }

    getDrawerState(collection, group, defaultValue) {
        const drawerStates = DataStore.getBDData("drawerStates") || {};
        if (!drawerStates[collection]) return defaultValue;
        if (!drawerStates[collection].hasOwnProperty(group)) return defaultValue;
        return drawerStates[collection][group];
    }

    onChange(onChange) {
        return (collection, category, id) => {
            onChange(collection, category, id);

            // Delay until after switch animation
            // TODO: lift settings state to SettingsPanel
            // to prevent the need for this.
            setTimeout(this.forceUpdate.bind(this), 250);
        };
    }

    buildSettingsPanel(id, title, config, state, onChange) {
        config.forEach(section => {
            section.settings.forEach(item => item.value = state[section.id][item.id]);
        });
        return this.getSettingsPanel(id, title, config, this.onChange(onChange));
    }

    getSettingsPanel(id, title, groups, onChange) {
        // return <SettingsPanel
        //             id={id}
        //             title={title}
        //             groups={groups}
        //             onChange={onChange}
        //             onDrawerToggle={(...args) => this.onDrawerToggle(...args)}
        //             getDrawerState={(...args) => this.getDrawerState(...args)}
        //         />;
        return [React.createElement(SettingsTitle, {text: title}, makeResetButton(id, this.forceUpdate.bind(this))), groups.map(section => {
            return React.createElement(SettingsGroup, Object.assign({}, section, {
                onChange: onChange,
                onDrawerToggle: state => this.onDrawerToggle(id, section.id, state),
                shown: this.getDrawerState(id, section.id, section.hasOwnProperty("shown") ? section.shown : true)
            }));
        })];
    }

    getAddonPanel(title, addonList, addonState, options = {}) {
        return () => React.createElement(AddonList, Object.assign({}, {
            title: title,
            addonList: addonList,
            addonState: addonState
        }, options));
    }

    async patchSections() {
        const UserSettings = await WebpackModules.getLazy(Filters.byPrototypeKeys(["getPredicateSections"]));
        
        Patcher.after("SettingsManager", UserSettings.prototype, "getPredicateSections", (thisObject, args, returnValue) => {
            let location = returnValue.findIndex(s => s.section.toLowerCase() == "changelog") - 1;
            if (location < 0) return;
            const insert = (section) => {
                returnValue.splice(location, 0, section);
                location++;
            };
            insert({section: "DIVIDER"});
            // Header
            insert({section: "CUSTOM", element: Header});
            for (const collection of Settings.collections) {
                if (collection.disabled) continue;
                insert({
                    section: collection.name,
                    label: collection.name.toString(),
                    className: `bd-${collection.id}-tab`,
                    element: () => this.buildSettingsPanel(collection.id, collection.name, collection.settings, Settings.state[collection.id], Settings.onSettingChange.bind(Settings, collection.id))
                });
            }
            for (const panel of Settings.panels.sort((a,b) => a.order > b.order ? 1 : -1)) {
                if (panel.clickListener) panel.onClick = (event) => panel.clickListener(thisObject, event, returnValue);
                if (!panel.className) panel.className = `bd-${panel.id}-tab`;
                if (typeof(panel.label) !== "string") panel.label = panel.label.toString();
                insert(panel);
            }
        });
    }

    forceUpdate() {
        const viewClass = WebpackModules.getByProps("standardSidebarView")?.standardSidebarView.split(" ")[0];
        const node = document.querySelector(`.${viewClass}`);
        if (!node) return;
        const stateNode = Utilities.findInTree(ReactUtils.getInternalInstance(node), m => m && m.getPredicateSections, {walkable: ["return", "stateNode"]});
        if (stateNode) stateNode.forceUpdate();
    }
};