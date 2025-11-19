import {useEffect,  useState} from "react";
import * as hon_abr_ws from "../ws/hon_abr_ws.ts";

import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import BaseMenuBar, {type BaseMenuItem} from "../dkm_comps/BaseMenuBar.tsx";
import {MITM_HON_LIST} from "../dkm_fakt_menu.ts";
//import {useLocation} from "wouter";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";
import type {CalcHonToSettleRes} from "../model/hon_abr_m.ts";
import HonAbrComp from "../comp/HonAbrComp.tsx";
import type {Float} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import type {WorkRepRow} from "../model/hon_form_m.ts";


//path("honorar/abrech/list_kuhon_work",vwhon.handle_honorar_abr_list_kuhon_work,name="hon_abrech_list_kuhon_work"),

function HonAbrCtrl() {

    const [s_dataRows, s_setDataRows] = useState<CalcHonToSettleRes>();
    //const [, navigate] = useLocation();
    const toastCenter = useToastCenter();



    useEffect(()=> {
        // Muss innerhalb von useEffect stehen ,sonst gibts endloss schleifen usw...
        async function wsGet() {
            try {
                const datarows = await hon_abr_ws.list_kuhon_work();
                s_setDataRows(datarows);
            } catch (e) {
                const errmsg = `wsget:hon_abr_ws:${e}`;
                showMayBeHtmlError(toastCenter,{
                    e, errprefix:errmsg
                })
            }
        }
        wsGet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    async function handleExecAbrech(chgData: CalcHonToSettleRes) {
        try {
            const savedDataRows = await hon_abr_ws.exec_abrech(chgData);
                s_setDataRows(savedDataRows);
        } catch (e) {
            const errmsg = `handleExecAbrech: chgData=${chgData}:${e}`;
            showMayBeHtmlError(toastCenter, {e,errprefix:errmsg})
        }
    }

    function buildMenuItem():BaseMenuItem {
        const ret = MITM_HON_LIST;
        return ret;
    }

    function renderMenuBar() {
        return <BaseMenuBar items={[buildMenuItem()]}  currentCapt={"Honorarabrechnung"}/>
    }

    async function handleLoadWorkRepRows(kuhon_nr:Float): Promise<Array<WorkRepRow>>{
        try {
            return hon_abr_ws.load_open_work_reps_by_kuhon_nr(kuhon_nr);
        }
        catch (e) {
            const errmsg = `handleLoadWorkRepRows: kuhon_nr=${kuhon_nr}:${e}`;
            showMayBeHtmlError(toastCenter, {e,errprefix:errmsg})
            throw errmsg;
        }
    }


    if (s_dataRows ) {
        return <BaseLayout menu={renderMenuBar()}>
            <HonAbrComp guiData={s_dataRows} execAbrech={handleExecAbrech} loadWorkRepRows={handleLoadWorkRepRows}/>
        </BaseLayout>

    } else {
        return <div>warten...</div>
    }
}

export default HonAbrCtrl;
