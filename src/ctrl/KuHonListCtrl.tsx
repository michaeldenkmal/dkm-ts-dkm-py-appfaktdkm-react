import {useEffect, useState} from "react";
import {useLocation} from "wouter";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import * as kuhon_list_ws from "../ws/kuhon_list_ws.ts";
import BaseMenuBar from "../dkm_comps/BaseMenuBar.tsx";
import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";
import type {KuHonViewRow} from "../model/kuhon_list_m.ts";
import KuHonListComp from "../comp/KuHonListComp.tsx";
import Toast from "../dkm_comps/Toast.tsx";


export default function KuHonListCtrl() {
    const [s_rows, s_setRows] = useState<Array<KuHonViewRow>|undefined>();
    const [, navigate] = useLocation();
    const toastCenter=  useToastCenter();

    useEffect(()=> {
        async function wsGet() {
            try {
                const rows = await kuhon_list_ws.get_all({
                    inactive:false
                });
                s_setRows(rows);
            }
            catch (e) {
                const errmsg = `wsget:kuhon_list:${e}`;
                showMayBeHtmlError(toastCenter,{
                    e, errprefix:errmsg
                })
            }
        }
        if (!s_rows) {
            wsGet()
        }
    },[])


    function renderMenu() {
        return <BaseMenuBar items={[]}
                            currentCapt={"Kundenliste"}></BaseMenuBar>
    }
    if (!s_rows) {
        return <Toast kind={"info"} message={"lade Daten"} />
    }
    return <BaseLayout menu={renderMenu()}>
        <KuHonListComp rows={s_rows} navigate={navigate}/>
    </BaseLayout>


}