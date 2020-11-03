import {HTML, Localization} from "../../../modulesCore";
import {Feature} from "../../../modulesContent";
import {Page} from "../../Page";

export default class FNewQueue extends Feature {

    checkPrerequisites() {
        return document.querySelector(".finish_queue_text");
    }

    apply() {
        HTML.afterEnd(".btn_next_in_queue",
            `<div id="es_new_queue" class="btn_next_in_queue btn_next_in_queue_trigger" data-tooltip-text="${Localization.str.queue.new_tooltip}">
                <div class="next_in_queue_content">
                    <span class="finish_queue_text">${Localization.str.queue.new}</span>
                </div>
            </div>`);

        Page.runInPageContext(() => {
            const f = window.SteamFacade;
            f.vTooltip("#es_new_queue", {
                "tooltipClass": "store_tooltip",
                "dataName": "tooltipText",
                "defaultType": "text",
                "replaceExisting": false
            });

            f.jqOnClick("#es_new_queue", () => {
                const jq = f.jq;
                const queueType = f.global("g_eDiscoveryQueueType");
                jq.ajax({
                    "url": `https://store.steampowered.com/explore/next/${queueType}/`,
                    "type": "POST",
                    "data": jq("#next_in_queue_form").serialize(),
                    "success": () => { window.location.href = `https://store.steampowered.com/explore/startnew/${queueType}/`; }

                    // TODO error handling, waiting on #231 and #275 to merge
                });
            });
        });
    }
}
