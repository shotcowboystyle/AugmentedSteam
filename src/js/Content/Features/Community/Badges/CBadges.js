import {HTMLParser} from "../../../../Core/Html/HtmlParser";
import {ContextType, DOMHelper, RequestData} from "../../../modulesContent";
import {CCommunityBase} from "../CCommunityBase";
import FCardExchangeLinks from "../FCardExchangeLinks";
import FBadgeSortAndFilter from "./FBadgeSortAndFilter";
import FBadgeCalculations from "./FBadgeCalculations";

export class CBadges extends CCommunityBase {

    constructor() {

        super(ContextType.BADGES, [
            FCardExchangeLinks,
            FBadgeSortAndFilter,
            FBadgeCalculations,
        ]);

        this.hasMultiplePages = document.querySelector(".pagebtn") !== null;
    }

    // TODO Cache this somehow or apply both FBadgeDropsCount & FBadgeSortAndFilter at once when doing these requests
    async eachBadgePage(callback) {
        const baseUrl = `https://steamcommunity.com/${window.location.pathname}?p=`;

        let skip = 1;
        const m = window.location.search.match(/p=(\d+)/);
        if (m) {
            skip = parseInt(m[1]);
        }

        const lastPage = parseInt(DOMHelper.selectLastNode(document, ".pagelink").textContent);
        for (let p = 1; p <= lastPage; p++) { // doing one page at a time to prevent too many requests at once
            if (p === skip) { continue; }
            try {
                const response = await RequestData.getHttp(baseUrl + p);

                const dom = HTMLParser.htmlToDOM(response);
                await callback(dom);

            } catch (exception) {
                console.error(`Failed to load ${baseUrl}${p}: ${exception}`);
                return;
            }
        }
    }
}
