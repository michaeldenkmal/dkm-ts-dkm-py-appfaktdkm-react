import {useEffect,  useState} from "react";

import * as kuhon_api_ws from "../ws/kunhon_api_ws.ts";
import BaseLayout from "../layout/BaseLayout.tsx";
import BaseMenuBar  from "../layout/BaseMenuBar.tsx";
import { MITM_KUHON_LIST} from "../layout/dkm_fakt_menu.ts";
import {useToastCenter} from "../dkm_comps/ToastCenterContext.tsx";
import type {Float} from "../dkm_django/dkm_django_m.ts";
import {showMayBeHtmlError} from "../dkm_comps/err_handling.tsx";
import type {KundenhonorarRow} from "../model/kuhon_form_m.ts";
import KuHonFormComp from "../comp/KuHonFormComp.tsx";
import {useDkmFaktCache} from "../store/useDkmFaktCache.tsx";
import type {OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";


interface Props {
    kuhon_nr: Float
}


function KuHonFormCtrl(props: Props) {

    const [s_row, s_setRow] = useState<KundenhonorarRow|undefined>();
    const toastCenter = useToastCenter();
    const dkmFaktCached =useDkmFaktCache();

    const [s_gpCbxItems, s_setGpCbxItems] = useState<Array<OptionItem>|undefined>()

    useEffect(() => {
        async function wsGet() {
            try {
                const row = await kuhon_api_ws.get_kuhon_row(props.kuhon_nr)
                s_setRow(row)
            } catch (e) {
                const errmsg = `wsget:kuhon_api_ws:nr=${props.kuhon_nr}:${e}`;
                showMayBeHtmlError(toastCenter,{
                    e, errprefix:errmsg
                })
            }
        }
        if(props.kuhon_nr ?? props.kuhon_nr!=0) {
            wsGet()
        }
    }, [props.kuhon_nr])

    useEffect(()=> {
        dkmFaktCached.getGpCxbItems()
            .then(items=> s_setGpCbxItems(items))
            .catch(e=> {
                const errmsg = `wsget:kuhon_api_ws:nr=${props.kuhon_nr}:${e}`;
                showMayBeHtmlError(toastCenter,{
                    e, errprefix:errmsg
                })
            });

        },[])

    async function handleSaveRow(chgRow:KundenhonorarRow) {
        try {
            const saved_row = await kuhon_api_ws.save(chgRow);
            s_setRow(saved_row);
            toastCenter.showSuccess(`erfolgreich gespeichert`)
        } catch (e) {
            const errmsg = `handleSaveGuiData: chgRpw=${chgRow}:${e}`;
            showMayBeHtmlError(toastCenter, {e,errprefix:errmsg})
        }
    }


    function renderMenuBar() {
        return <BaseMenuBar items={[MITM_KUHON_LIST]}  currentCapt={"Honorar bearbeiten"}/>
    }




    if (s_row && s_gpCbxItems) {
        return <BaseLayout menu={renderMenuBar()}>
            <KuHonFormComp
                row={s_row}
                onSaveRow={handleSaveRow} getGpOptionItems={s_gpCbxItems}/>
        </BaseLayout>
    } else {
        return <div>warten...</div>
    }
}

export default KuHonFormCtrl;