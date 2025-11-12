import type {OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";
import {setDkmGenCache, useDkmGenCache} from "./useDkmGenCache.tsx";
import * as kunhon_api_ws from "../ws/kunhon_api_ws.ts";

interface IDkmFaktCache {
    getKuhonCbxItems: () => Promise<Array<OptionItem>>
    getGpCxbItems:()=>Promise<Array<OptionItem>>
    getv: <T>(key: string) => T|null
    setv: <T>(key: string, value: T|null) => void
    removev: (key: string) => void
}

function checkFaktCacheProp(prop: keyof IDkmFaktCache): string {
    return prop as unknown as string;
}
const kvStore :Record<string, any>= {};

export function useDkmFaktCache(): IDkmFaktCache {
    const kuhonCbxItems =
        useDkmGenCache<Array<OptionItem>>(checkFaktCacheProp("getKuhonCbxItems"));

    const gpCxbItems =
        useDkmGenCache<Array<OptionItem>>(checkFaktCacheProp("getGpCxbItems"));
    async function getKuhonCbxItems(): Promise<Array<OptionItem>> {
        if (!kuhonCbxItems) {
            const items = await kunhon_api_ws.cbxItems();
            setDkmGenCache(checkFaktCacheProp("getKuhonCbxItems"), items);
            return items;
        }
        return kuhonCbxItems || [];
    }

    async function getGpCxbItems(): Promise<Array<OptionItem>> {
        if (!gpCxbItems) {
            const items = await kunhon_api_ws.get_gp_cbx();
            setDkmGenCache(checkFaktCacheProp("getGpCxbItems"), items);
            return items;
        }
        return gpCxbItems || [];
    }

    function getv<T> (key: string) :T|null {
        const ret = kvStore[key];
        if (!ret) {
            return null;
        }
        return ret;
    }
    function setv<T> (key: string, value: T|null) : void {
        kvStore[key] = value;
    }
    function removev (key: string) :void {
        delete kvStore[key];
    }
    return {
        getKuhonCbxItems,
        getGpCxbItems,
        setv,
        getv,
        removev
    }
}