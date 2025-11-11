import {createEmptyHonListSearchData, type HonListSearchData, type HonListViewModel} from "../model/hon_list_m.ts";
import {useState} from "react";
import {useLocation} from "wouter";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import useSearchWithLink from "../dkm_comps/useSearchWithLink.ts";
import * as hon_list_ws from "../ws/hon_list_ws.ts";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import BaseMenuBar from "../layout/BaseMenuBar.tsx";
import {MITM_HON_ABRECH, MITM_RECH_LIST} from "../layout/dkm_fakt_menu.ts";
import BaseLayout from "../layout/BaseLayout.tsx";
import HonListComp from "../comp/HonListComp.tsx";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";

interface Props {
    searchKey?:string
}
interface SearchState {
    honList: HonListViewModel[];
    searchData: HonListSearchData
}

export default function HonListCtrl(props: Props) {
    const [s_searchData, s_setSearchData] = useState<HonListSearchData>(
        createEmptyHonListSearchData());
    const [s_honListRows, s_setHonListRows] = useState<Array<HonListViewModel>>([]);
    const [, navigate] = useLocation();
    const toastCenter= useToastCenter();
    const searchWithLink = useSearchWithLink<SearchState>({
        searchKey:props.searchKey||"start",
        onStateLoaded:state => {
            s_setHonListRows(state.honList);
            s_setSearchData(state.searchData)
        }
    })

    function handleHonListSearch(searchData: HonListSearchData) {
        s_setSearchData(searchData);
        hon_list_ws.hon_list_search(searchData)
            .then(rows => {
                const searchState:SearchState = {
                    honList:rows,
                    searchData
                }
                //dkmfaktCache.setv(newSearchKey, searchState);
                //s_setRechListRows(rows);
                const newSearchKey = searchWithLink.saveSearchState(searchState);
                navigate(DkmFaktRouterConsts.getHonListSearchUrl(newSearchKey));
            })
            .catch(err => {
                showMayBeHtmlError(toastCenter,err);
            })
    }


    function renderMenu() {
        return <BaseMenuBar items={[MITM_RECH_LIST,MITM_HON_ABRECH]}
                            currentCapt={"Honorar suchen..."}></BaseMenuBar>
    }
    return <BaseLayout menu={renderMenu()}>
        <HonListComp rows={s_honListRows}
                      onStartSearch={handleHonListSearch}
                      searchData={s_searchData}
                      uq_searchKey={props.searchKey||"start"}
                      navigate={url=>navigate(url)}
        />

    </BaseLayout>


}