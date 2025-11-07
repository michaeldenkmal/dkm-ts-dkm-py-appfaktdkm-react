import {useEffect,  useState} from "react";
import {createNewRechGuiData, type RechFormRowErrs, type RechGuiData} from "../model/rech_form_m.ts";
import * as rech_form_ws from "../ws/rech_form_ws.ts";
import RechFormComp from "../comp/RechFormComp.tsx";
import type {OptionItem} from "../dkm_comps/DkmNativeSelect.tsx";
import {useDkmFaktCache} from "../store/useDkmFaktCache.tsx";

import BaseLayout from "../layout/BaseLayout.tsx";
import BaseMenuBar, {type BaseMenuItem} from "../layout/BaseMenuBar.tsx";
import {MITM_RECH_FORM} from "../layout/dkm_fakt_menu.ts";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import {useLocation} from "wouter";


interface Props {
    vnr: number
    unique_search_key: string
}


function RechFormCtrl(props: Props) {

    const [s_rechGuiData, s_setRechGuiData] = useState<RechGuiData>();
    const [s_rechFormRowErrs, s_setRechFormRowErrs] = useState<RechFormRowErrs>();
    const [s_kunhonCbxItems, s_setkuhonCbxItems] = useState<Array<OptionItem>>();
    const dkmfaktCache = useDkmFaktCache();
    const [, navigate] = useLocation();

    useEffect(() => {
        dkmfaktCache.getKuhonCbxItems()
            .then(res => {
                s_setkuhonCbxItems(res);
            });
    });

    async function wsGet() {
        try {
            const guidata = await rech_form_ws.rech_form_get_by_vnr(props.vnr);
            s_setRechGuiData(guidata);
        } catch (e) {
            throw Error((e as any).toString())
        }
    }

    useEffect(() => {
        if(props.vnr ?? props.vnr!=0) {
            wsGet()
        }
        if (props.vnr==0) {
            // Neuer Datensatz
            s_setRechGuiData(createNewRechGuiData())
        }
    }, [props.vnr])

    async function handleSaveGuiData(chgGuiData: RechGuiData) {
        try {
            const saveres = await rech_form_ws.rech_form_save(chgGuiData);
            if (saveres.errors) {
                s_setRechFormRowErrs(saveres.errors);
            } else if (saveres.rech_data) {
                s_setRechGuiData(saveres.rech_data);
                navigate(DkmFaktRouterConsts.getRechFormUrl(saveres.rech_data.rech_row?.vnr ||0, "saved"))
            } else {
                throw new Error("errors und rech_Data is null");
            }
        } catch (e) {
            throw new Error((e as any).toString());
        }
    }

    function buildMenuItem():BaseMenuItem {
        const ret = MITM_RECH_FORM;
        ret.path = DkmFaktRouterConsts.getRechListSearchUrl(props.unique_search_key);
        return ret;
    }

    function renderMenuBar() {
        return <BaseMenuBar items={[buildMenuItem()]}  currentCapt={"Rechnung bearbeiten"}/>
    }

    async function handelRemovePosRow(posRowNr:number):Promise<void> {
        await rech_form_ws.remove_pos_row(posRowNr);
    }

    async function handleCreateDocx(vnr:number):Promise<number> {
        return rech_form_ws.createDocx(vnr);
    }

    if (s_rechGuiData && s_rechGuiData.rech_row && s_kunhonCbxItems) {
        return <BaseLayout menu={renderMenuBar()}>
            <RechFormComp
                guiData={s_rechGuiData}
                kuhonCbx={s_kunhonCbxItems}
                rechFormRowErrs={s_rechFormRowErrs}
                fnSaveGuiData={handleSaveGuiData}
                fnRemovePosRow={handelRemovePosRow}
                fnCreateDox={handleCreateDocx}
            />
        </BaseLayout>

    } else {
        return <div>warten...</div>
    }
}

export default RechFormCtrl;