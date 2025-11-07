import {useEffect} from "react";
import {getUniqueStr} from "@at.dkm/dkm-ts-lib-gen/lib/u";

interface Props<T> {
    searchKey: string;
    onStateLoaded:(state:T) => void;
}

const kvStore:Record<string, any> = {};

interface UseSearchWithLinkRes<T> {
    // getv:<T>(key:string) => T|null|undefined;
    // setv:<T>(key:string, val:T|null|undefined)=>void;
    // delv:(key:string)=>void;
    saveSearchState:(val:T|null|undefined)=>string;
}

export default function useSearchWithLink<T>(props:Props<T>): UseSearchWithLinkRes<T> {
    function getv(key:string) : T {
        return kvStore[key];
    }
    function setv(key:string, val:T|null|undefined):void {
        kvStore[key] = val;
    }
    // function delv(key:string):void {
    //     delete kvStore[key];
    // }
    function saveSearchState(val:T|null|undefined):string {
        const newKey =getUniqueStr();
        setv(newKey,val);
        return newKey;
    }

    //                 dkmfaktCache.setv(newSearchKey, searchState);
    //                 s_setRechListRows(rows);
    //                 navigate(DkmFaktRouterConsts.getRechListSearchUrl(newSearchKey));
    useEffect(() => {
        if (props.searchKey) {
            if (props.searchKey!="start") {
                //const searchState =dkmfaktCache.getv<SearchState>(props.searchKey);
                const searchState = getv(props.searchKey);
                if (searchState) {
                    //s_setRechListRows(searchState.rechList);
                    //s_setSearchData(searchState.searchData);
                    props.onStateLoaded(searchState);
                }
            }
        }
    }, [props.searchKey]);
    return {
        saveSearchState
    }

}

