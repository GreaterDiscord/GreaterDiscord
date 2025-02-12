import React from "@modules/react";
import Strings from "@modules/strings";
import Events from "@modules/emitter";
import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discordmodules";
import ipc from "@modules/ipc";

import Button from "../base/button";
import SettingsTitle from "./title";
import AddonCard from "./addoncard";
import Dropdown from "./components/dropdown";
import Search from "./components/search";

import Modals from "@ui/modals";
import ErrorBoundary from "@ui/errorboundary";

import ListIcon from "@ui/icons/list";
import GridIcon from "@ui/icons/grid";
import FolderIcon from "@ui/icons/folder";
import CheckIcon from "@ui/icons/check";
import CloseIcon from "@ui/icons/close";

import NoResults from "@ui/blankslates/noresults";
import EmptyImage from "@ui/blankslates/emptyimage";

const {useState, useCallback, useEffect, useReducer, useMemo} = React;


const buildSortOptions = () => [
    {label: Strings.Addons.name, value: "name"},
    {label: Strings.Addons.author, value: "author"},
    {label: Strings.Addons.version, value: "version"},
    {label: Strings.Addons.added, value: "added"},
    {label: Strings.Addons.modified, value: "modified"},
    {label: Strings.Addons.isEnabled, value: "isEnabled"}
];

const buildDirectionOptions = () => [
    {label: Strings.Sorting.ascending, value: true},
    {label: Strings.Sorting.descending, value: false}
];


function openFolder(folder) {
    ipc.openPath(folder);
}

function blankslate(type, onClick) {
    const message = Strings.Addons.blankSlateMessage.format({link: `https://betterdiscord.app/${type}s`, type}).toString();
    return <EmptyImage title={Strings.Addons.blankSlateHeader.format({type})} message={message}>
        <Button size={Button.Sizes.LARGE} onClick={onClick}>{Strings.Addons.openFolder.format({type})}</Button>
    </EmptyImage>;
}

function makeBasicButton(title, children, action) {
    return <DiscordModules.Tooltip color="primary" position="top" text={title}>
                {(props) => <Button {...props} size={Button.Sizes.NONE} look={Button.Looks.BLANK} className="gd-button" onClick={action}>{children}</Button>}
            </DiscordModules.Tooltip>;
}

function makeControlButton(title, children, action, selected = false) {
    return <DiscordModules.Tooltip color="primary" position="top" text={title}>
                {(props) => {
                    return <Button {...props} size={Button.Sizes.NONE} look={Button.Looks.BLANK} className={"gd-button gd-view-button" + (selected ? " selected" : "")} onClick={action}>{children}</Button>;
                }}
            </DiscordModules.Tooltip>;
}

function getState(type, control, defaultValue) {
    const addonlistControls = DataStore.getBDData("addonlistControls") || {};
    if (!addonlistControls[type]) return defaultValue;
    if (!addonlistControls[type].hasOwnProperty(control)) return defaultValue;
    return addonlistControls[type][control];
}

function saveState(type, control, value) {
    const addonlistControls = DataStore.getBDData("addonlistControls") || {};
    if (!addonlistControls[type]) addonlistControls[type] = {};
    addonlistControls[type][control] = value;
    DataStore.setBDData("addonlistControls", addonlistControls);
}

function confirmDelete(addon) {
    return new Promise(resolve => {
        Modals.showConfirmationModal(Strings.Modals.confirmAction, Strings.Addons.confirmDelete.format({name: addon.name}), {
            danger: true,
            confirmText: Strings.Addons.deleteAddon,
            onConfirm: () => {resolve(true);},
            onCancel: () => {resolve(false);}
        });
    });
}

/**
 * @param {function} action 
 * @param {string} type
 * @returns 
 */
function confirmEnable(action, type) {
    /**
     * @param {MouseEvent} event
     */
    return function(event) {
        if (event.shiftKey) return action();
        Modals.showConfirmationModal(Strings.Modals.confirmAction, Strings.Addons.enableAllWarning.format({type: type.toLocaleLowerCase()}), {
            confirmText: Strings.Modals.okay,
            cancelText: Strings.Modals.cancel,
            danger: true,
            onConfirm: action,
        });
    };
}


export default function AddonList({prefix, type, title, folder, addonList, addonState, onChange, reload, editAddon, deleteAddon, enableAll, disableAll}) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState(getState.bind(null, type, "sort", "name"));
    const [ascending, setAscending] = useState(getState.bind(null, type, "ascending", true));
    const [view, setView] = useState(getState.bind(null, type, "view", "list"));
    const [forced, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        Events.on(`${prefix}-loaded`, forceUpdate);
        Events.on(`${prefix}-unloaded`, forceUpdate);
        return () => {
            Events.off(`${prefix}-loaded`, forceUpdate);
            Events.off(`${prefix}-unloaded`, forceUpdate);
        };
    }, [prefix]);

    const changeView = useCallback((value) => {
        saveState(type, "view", value);
        setView(value);
    }, [type]);

    const listView = useCallback(() => changeView("list"), [changeView]);
    const gridView = useCallback(() => changeView("grid"), [changeView]);

    const changeDirection = useCallback((value) => {
        saveState(type, "ascending", value);
        setAscending(value);
    }, [type]);

    const changeSort = useCallback((value) => {
        saveState(type, "sort", value);
        setSort(value);
    }, [type]);

    const search = useCallback((e) => setQuery(e.target.value.toLocaleLowerCase()), []);
    const triggerEdit = useCallback((id) => editAddon?.(id), [editAddon]);
    const triggerDelete = useCallback(async (id) => {
        const addon = addonList.find(a => a.id == id);
        const shouldDelete = await confirmDelete(addon);
        if (!shouldDelete) return;
        if (deleteAddon) deleteAddon(addon);
    }, [addonList, deleteAddon]);

    const renderedCards = useMemo(() => {
        let sorted = addonList.sort((a, b) => {
            const sortByEnabled = sort === "isEnabled";
            const first = sortByEnabled ? addonState[a.id] : a[sort];
            const second = sortByEnabled ? addonState[b.id] : b[sort]; 
            const stringSort = (str1, str2) => str1.toLocaleLowerCase().localeCompare(str2.toLocaleLowerCase());
            if (typeof(first) == "string") return stringSort(first, second);
            if (typeof(first) == "boolean") return (first === second) ? stringSort(a.name, b.name) : first ? -1 : 1;
            if (first > second) return 1;
            if (second > first) return -1;
            return 0;
        });

        if (!ascending) sorted.reverse();

        if (query) {
            sorted = sorted.filter(addon => {
                let matches = addon.name.toLocaleLowerCase().includes(query);
                matches = matches || addon.author.toLocaleLowerCase().includes(query);
                matches = matches || addon.description.toLocaleLowerCase().includes(query);
                if (!matches) return false;
                return true;
            });
        }

        return sorted.map(addon => {
            const hasSettings = addon.instance && typeof(addon.instance.getSettingsPanel) === "function";
            const getSettings = hasSettings && addon.instance.getSettingsPanel.bind(addon.instance);
            return <ErrorBoundary><AddonCard disabled={addon.partial} type={type} prefix={prefix} editAddon={() => triggerEdit(addon.id)} deleteAddon={() => triggerDelete(addon.id)} key={addon.id} enabled={addonState[addon.id]} addon={addon} onChange={onChange} reload={reload} hasSettings={hasSettings} getSettingsPanel={getSettings} /></ErrorBoundary>;
        });
    }, [addonList, addonState, onChange, reload, triggerDelete, triggerEdit, type, prefix, sort, ascending, query, forced]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasAddonsInstalled = addonList.length !== 0;
    const isSearching = !!query;
    const hasResults = renderedCards.length !== 0;

    return [
        <SettingsTitle key="title" text={isSearching ? `${title} - ${Strings.Addons.results.format({count: `${renderedCards.length}`})}` : title}>
            <Search onChange={search} placeholder={`${Strings.Addons.search.format({type: `${renderedCards.length} ${title}`})}...`} />
        </SettingsTitle>,
        <div className={"gd-controls gd-addon-controls"}>
            {/* <Search onChange={search} placeholder={`${Strings.Addons.search.format({type: title})}...`} /> */}
            <div className="gd-controls-basic">
                {makeBasicButton(Strings.Addons.openFolder.format({type: title}), <FolderIcon />, openFolder.bind(null, folder))}
                {makeBasicButton(Strings.Addons.enableAll, <CheckIcon size="20px" />, confirmEnable(enableAll, title))}
                {makeBasicButton(Strings.Addons.disableAll, <CloseIcon size="20px" />, disableAll)}
            </div>
            <div className="gd-controls-advanced">
                <div className="gd-addon-dropdowns">
                    <div className="gd-select-wrapper">
                        <label className="gd-label">{Strings.Sorting.sortBy}:</label>
                        <Dropdown options={buildSortOptions()} value={sort} onChange={changeSort} style="transparent" />
                    </div>
                    <div className="gd-select-wrapper">
                        <label className="gd-label">{Strings.Sorting.order}:</label>
                        <Dropdown options={buildDirectionOptions()} value={ascending} onChange={changeDirection} style="transparent" />
                    </div>
                </div>
                <div className="gd-addon-views">
                    {makeControlButton(Strings.Addons.listView, <ListIcon />, listView, view === "list")}
                    {makeControlButton(Strings.Addons.gridView, <GridIcon />, gridView, view === "grid")}
                </div>
            </div>
        </div>,
        !hasAddonsInstalled && blankslate(type, () => openFolder(folder)),
        isSearching && !hasResults && hasAddonsInstalled && <NoResults />,
        hasAddonsInstalled && <div key="addonList" className={"gd-addon-list" + (view == "grid" ? " gd-grid-view" : "")}>{renderedCards}</div>
    ];
}
