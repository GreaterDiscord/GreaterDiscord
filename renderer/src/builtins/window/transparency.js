import Builtin from "@structs/builtin";

import Strings from "@modules/strings";
import IPC from "@modules/ipc";

import Modals from "@ui/modals";


export default new class WindowTransparency extends Builtin {
    get name() {return "WindowTransparency";}
    get category() {return "window";}
    get id() {return "transparency";}

    enabled() {
        this.showModal(Strings.WindowPrefs.enabledInfo);
        document.body.classList.add("gd-transparency");
    }

    disabled() {
        this.showModal(Strings.WindowPrefs.disabledInfo);
        document.body.classList.remove("gd-transparency");
    }

    showModal(info) {
        if (!this.initialized) return;
        Modals.showConfirmationModal(Strings.Modals.additionalInfo, info, {
            confirmText: Strings.Modals.restartNow,
            cancelText: Strings.Modals.restartLater,
            danger: true,
            onConfirm: () => IPC.relaunch()
        });
    }
};