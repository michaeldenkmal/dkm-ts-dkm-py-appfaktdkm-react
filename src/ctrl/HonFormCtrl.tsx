import {useEffect,  useState} from "react";
import * as hon_form_ws from "../ws/hon_form_ws.ts";

import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import BaseMenuBar, {type BaseMenuItem} from "../dkm_comps/BaseMenuBar.tsx";
import {MITM_HON_LIST} from "../dkm_fakt_menu.ts";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import type {HonGuiData} from "../model/hon_form_m.ts";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import HonFormComp from "../comp/HonFormComp.tsx";
import type {Float} from "../dkm_django/dkm_django_m.ts";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";


interface Props {
    hon_float_nr: number
    unique_search_key: string
}


function HonFormCtrl(props: Props) {

    const [s_guiData, s_setGuiData] = useState<HonGuiData>();
    const toastCenter = useToastCenter();



    useEffect(() => {
        async function wsGet() {
            try {
                const guidata = await hon_form_ws.get_honorar_by_nr(props.hon_float_nr);
                s_setGuiData(guidata);
            } catch (e) {
                const errmsg = `wsget:get_honorar_by_nr:hon_float_nr=${props.hon_float_nr}:${e}`;
                showMayBeHtmlError(toastCenter,{
                    e, errprefix:errmsg
                })
            }
        }
        if(props.hon_float_nr ?? props.hon_float_nr!=0) {
            wsGet()
        }
    }, [props.hon_float_nr,toastCenter])

    async function handleSaveGuiData(chgGuiData: HonGuiData) {
        try {
            const savedGuiData = await hon_form_ws.update(chgGuiData);
                s_setGuiData(savedGuiData);
        } catch (e) {
            const errmsg = `handleSaveGuiData: chgGuiData=${chgGuiData}:${e}`;
            showMayBeHtmlError(toastCenter, {e,errprefix:errmsg})
        }
    }

    function buildMenuItem():BaseMenuItem {
        const ret = MITM_HON_LIST;
        ret.path = DkmFaktRouterConsts.getHonListSearchUrl(props.unique_search_key);
        return ret;
    }

    function renderMenuBar() {
        return <BaseMenuBar items={[buildMenuItem()]}  currentCapt={"Honorar bearbeiten"}/>
    }


    async function handleCreateDocx(hon_float_nr:number):Promise<number> {
        return hon_form_ws.cre_docx(hon_float_nr);
    }

    async function handleResettleHonorar(lastSettleDate:Date, nr:Float):Promise<void> {
        try {
            const newGuiData = await  hon_form_ws.resettle_json({
                last_settle_date: lastSettleDate,
                nr
            })
            s_setGuiData(newGuiData);
            toastCenter.showSuccess("Neuberechnung erfolgreich", 2000);
        } catch(e) {
            const errmsg = `neuberechnen: letztes Datum für Arbeitsbericht: ${lastSettleDate},
                honorar pk:${nr},${e}`
            showMayBeHtmlError(toastCenter, { e, errprefix:errmsg})
        }

    }

    if (s_guiData && s_guiData.hon_row) {
        return <BaseLayout menu={renderMenuBar()}>
            <HonFormComp
                guiData={s_guiData}
                fnSaveGuiData={handleSaveGuiData}
                fnCreateDocx={handleCreateDocx}
                fnResettleHonorar={handleResettleHonorar}
            />
        </BaseLayout>

    } else {
        return <div>warten...</div>
    }
}

export default HonFormCtrl;