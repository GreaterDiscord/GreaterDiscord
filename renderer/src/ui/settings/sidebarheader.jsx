import Changelog from "@data/changelog";

import React from "@modules/react";
import DiscordModules from "@modules/discordmodules";
import Strings from "@modules/strings";

import HistoryIcon from "@ui/icons/history";

import Modals from "@ui/modals";
import Button from "@ui/base/button";


export default function SettingsTitle() {
    return <div className="gd-sidebar-header">
                <h2 className="gd-sidebar-header-label">GreaterDiscord</h2>
                <DiscordModules.Tooltip color="primary" position="top" text={Strings.Modals.changelog}>
                    {props =>
                        <Button {...props} className="gd-changelog-button" look={Button.Looks.BLANK} color={Button.Colors.TRANSPARENT} size={Button.Sizes.NONE} onClick={() => Modals.showChangelogModal(Changelog)}>
                            <HistoryIcon className="gd-icon" size="16px" />
                        </Button>
                    }
                </DiscordModules.Tooltip>
            </div>;
}