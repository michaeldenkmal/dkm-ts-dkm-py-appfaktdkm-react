//https://chatgpt.com/c/6907b62d-413c-832e-ba12-a8e4b58d9d8e

import {useState} from "react";
import {createEmptyRechListSearchData, type RechListSearchData, type RechListViewModel} from "../model/rech_list_m.ts";
import RechListComp from "../comp/RechListComp.tsx";
import * as rech_list_ws from "../ws/rech_list_ws.ts";
import {useLocation} from "wouter";
import useSearchWithLink from "../dkm_comps/useSearchWithLink.ts";

import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import BaseMenuBar from "../dkm_comps/BaseMenuBar.tsx";
import {MITM_RECH_LIST, MITM_RECH_NEW} from "../dkm_fakt_menu.ts";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";

interface Props {
    searchKey?:string
}
interface SearchState {
    rechList: RechListViewModel[];
    searchData: RechListSearchData
}

const RechListCtrl = function RechListCtrl(props:Props) {
    const [s_searchData, s_setSearchData] = useState<RechListSearchData>(createEmptyRechListSearchData());
    const [s_rechListRows, s_setRechListRows] = useState<Array<RechListViewModel>>([]);
    const [, navigate] = useLocation();
    const toastCenter= useToastCenter();
    const searchWithLink = useSearchWithLink<SearchState>({
        searchKey:props.searchKey||"start",
        onStateLoaded:state => {
            s_setRechListRows(state.rechList);
            s_setSearchData(state.searchData)
        }
    })
    // useEffect(() => {
    //     if (props.searchKey) {
    //         if (props.searchKey!="start") {
    //             s_setSearchKey(props.searchKey);
    //             const searchState =dkmfaktCache.getv<SearchState>(props.searchKey);
    //             if (searchState) {
    //                 s_setRechListRows(searchState.rechList);
    //                 s_setSearchData(searchState.searchData);
    //             }
    //         } else {
    //             s_setSearchKey(getUniqueStr());
    //         }
    //     } else {
    //         s_setSearchKey(getUniqueStr());
    //     }
    // }, [props.searchKey]);
    function handleRechListSearch(searchData: RechListSearchData) {
        s_setSearchData(searchData);
        rech_list_ws.rech_list_search(searchData)
            .then(rows => {
                const searchState:SearchState = {
                    rechList:rows,
                    searchData
                }
                //dkmfaktCache.setv(newSearchKey, searchState);
                //s_setRechListRows(rows);
                const newSearchKey = searchWithLink.saveSearchState(searchState);
                navigate(DkmFaktRouterConsts.getRechListSearchUrl(newSearchKey));
            })
            .catch(err => {
                showMayBeHtmlError(toastCenter, err)
            })
    }


    function renderMenu() {
        return <BaseMenuBar items={[MITM_RECH_LIST,MITM_RECH_NEW]} currentCapt={"Rechnungen suchen..."}></BaseMenuBar>
    }
    return <BaseLayout menu={renderMenu()}>
        <RechListComp rows={s_rechListRows}
                      onStartSearch={handleRechListSearch}
                      searchData={s_searchData}
                      uq_searchKey={props.searchKey||"start"}
                      navigate={url=>navigate(url)}
        />

    </BaseLayout>

};



export default RechListCtrl;