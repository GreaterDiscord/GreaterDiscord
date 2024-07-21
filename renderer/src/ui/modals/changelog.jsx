import React from "@modules/react";
import WebpackModules from "@modules/webpackmodules";
import DiscordModules from "@modules/discordmodules";
import Strings from "@modules/strings";

import Root from "./root";
import Header from "./header";
import Footer from "./footer";
import Content from "./content";

import Flex from "../base/flex";
import Text from "../base/text";
import CloseButton from "./close";

import SimpleMarkdownExt from "@structs/markdown";
import Twitter from "@ui/icons/twitter";
import GitHub from "@ui/icons/github";

const {useMemo} = React;


const AnchorClasses = WebpackModules.getByProps("anchorUnderlineOnHover") || {anchor: "anchor-3Z-8Bb", anchorUnderlineOnHover: "anchorUnderlineOnHover-2ESHQB"};
const joinSupportServer = (click) => {
    click.preventDefault();
    click.stopPropagation();
    DiscordModules.InviteActions.acceptInviteAndTransitionToInviteChannel({inviteKey: "0Tmfo5ZbORCRqbAd"});
};

const supportLink = <a className={`${AnchorClasses.anchor} ${AnchorClasses.anchorUnderlineOnHover}`} onClick={joinSupportServer}>Join our Discord Server.</a>;
const defaultFooter = <Text>Need support? {supportLink}</Text>;

const twitter = <DiscordModules.Tooltip color="primary" position="top" text={Strings.Socials.twitter}>
    {p => <a {...p} className="gd-social" href="https://x.com/_GreaterDiscord_" rel="noopener noreferrer" target="_blank">
        <Twitter />
        </a>}
    </DiscordModules.Tooltip>;

const github = <DiscordModules.Tooltip color="primary" position="top" text={Strings.Socials.github}>
    {p => <a {...p} className="gd-social" href="https://github.com/foxypiratecove37350/GreaterDiscord" rel="noopener noreferrer" target="_blank">
        <GitHub />
        </a>}
    </DiscordModules.Tooltip>;

function YoutubeEmbed({src}) {
    return <iframe
            src={src}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />;
}

function Video({src, poster}) {
    if (src.toLowerCase().includes("youtube.com")) return <YoutubeEmbed src={src} />;
    return <video src={src} poster={poster} controls={true} className="gd-changelog-poster" />;
}


export default function ChangelogModal({transitionState, footer, title, subtitle, onClose, video, poster, image, description, changes}) {

    const ChangelogHeader = useMemo(() => <Header justify={Flex.Justify.BETWEEN}>
        <Flex direction={Flex.Direction.VERTICAL}>
            <Text tag="h1" size={Text.Sizes.SIZE_20} strong={true}>{title}</Text>
            <Text size={Text.Sizes.SIZE_12} color={Text.Colors.HEADER_SECONDARY}>{subtitle}</Text>
        </Flex>
        <CloseButton onClick={onClose} />
    </Header>, [title, subtitle, onClose]);

    const ChangelogFooter = useMemo(() => <Footer justify={Flex.Justify.BETWEEN} direction={Flex.Direction.HORIZONTAL}>
        <Flex.Child grow="1" shrink="1">
            {footer ? footer : defaultFooter}
        </Flex.Child>
        {!footer && <Flex.Child grow="0" shrink="0">
            {twitter}
            {github}
        </Flex.Child>}
    </Footer>, [footer]);

    const changelogItems = useMemo(() => {
        const items = [video ? <Video src={video} poster={poster} /> : <img src={image} className="gd-changelog-poster" />];
        if (description) items.push(<p>{SimpleMarkdownExt.parseToReact(description)}</p>);
        for (let c = 0; c < changes.length; c++) {
            const entry = changes[c];
            const type = "gd-changelog-" + entry.type;
            const margin = c == 0 ? " gd-changelog-first" : "";
            items.push(<h1 className={`gd-changelog-title ${type}${margin}`}>{entry.title}</h1>);
            if (entry.description) items.push(<p>{SimpleMarkdownExt.parseToReact(entry.description)}</p>);
            const list = <ul>{entry.items.map(i => <li>{SimpleMarkdownExt.parseToReact(i)}</li>)}</ul>;
            items.push(list);
        }
        return items;
    }, [description, video, image, poster, changes]);

    return <Root className="gd-changelog-modal" transitionState={transitionState} size={Root.Sizes.MEDIUM} style={Root.Styles.STANDARD}>
        {ChangelogHeader}
        <Content>{changelogItems}</Content>
        {ChangelogFooter}
    </Root>;
}