import DkmRespTableMain from "../dkm_comps/DkmRespTableMain.tsx";
import DkmRespTableHead from "../dkm_comps/DkmRespTableHead.tsx";
import DkmRespTableHeadTh from "../dkm_comps/DkmRespTableHeadTh.tsx";
import DkmRespTableRow from "../dkm_comps/DkmRespTableRow.tsx";
import DkmRespTableCell from "../dkm_comps/DkmRespTableCell.tsx";
import {useLayoutEffect} from "react";
import {fmtGermanNum} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import {useRowScroller} from "../dkm_comps/useRowScroller.tsx";
import type {KuHonViewRow} from "../model/kuhon_list_m.ts";
import type {Float, MayBeFloat} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

interface Props {
    rows: Array<KuHonViewRow>
    navigate:(path:string) => void
}

interface KuHonListCompTableProps {
    rows: Array<KuHonViewRow>
    navigate:(path:string) => void
}

let lastClickKuHonNr:MayBeFloat=0;

//                 <th class="table-head-th">Rechnungsnr</th>
//                 <th class="table-head-th">Kundenname</th>
//                 <th class="table-head-th">Betrag</th>
function KuHonListCompTable(props: KuHonListCompTableProps) {
    const rowScroller = useRowScroller();

    useLayoutEffect(()=>{
        if (lastClickKuHonNr) {
            rowScroller.scrollToRow(lastClickKuHonNr);
        }
    },[props.rows, rowScroller]);

    function handleOnLinkChange(kuhon_nr:Float,url:string) {
        lastClickKuHonNr=kuhon_nr;
        props.navigate(url);
    }

    function calcTrClass(row:KuHonViewRow) {
        const classes:string[] = ["hover:bg-blue-50"];
        if (lastClickKuHonNr == row.nr) {
            classes.push("bg-green-100");
        }
        return classes.join(" ");
    }

    function handleTrMousEnter(row: KuHonViewRow) {
        lastClickKuHonNr = row.nr;
    }

    function renderTableRow(row: KuHonViewRow) {
        function handelNrClick() {
            handleOnLinkChange(row.nr||0,DkmFaktRouterConsts.getKuHonFormUrl(row.nr||0))
        }
        if (!row.nr) {
            return  null;
        }
        return <DkmRespTableRow key={row.nr} ref={rowScroller.registerRowRef(row.nr)}
            additionalClasses={calcTrClass(row) }
            onMouseEnter={()=>handleTrMousEnter(row)}
        >
            {/*//     nr:MayBeFloat*/}
            <DkmRespTableCell label={"nr"} tdClass={"text-left"}>
                <div className={"dkm-link"}
                      onClick={handelNrClick} >
                    {row.nr}</div>
            </DkmRespTableCell>
            {/*//     kundenName:MayBeString*/}
            <DkmRespTableCell label={"Kundenname"} tdClass={"text-left"}>
                {row.kundenName}
            </DkmRespTableCell>
            {/*//     gp_id:MayBeFloat*/}
            <DkmRespTableCell label={"gp_id"} tdClass={"text-left md:text-right"}>
                {row.gp_id}
            </DkmRespTableCell>
            {/*//     email:MayBeString*/}
            <DkmRespTableCell label={"E-Mail"} tdClass={"text-left"}>
                {row.email}
            </DkmRespTableCell>
            {/*//     stundenhon:MayBeFloat*/}
            <DkmRespTableCell label={"Stundenhonorar"} tdClass={"text-left md:text-right"}>
                {fmtGermanNum(row.stundenhon||0)}
            </DkmRespTableCell>
        </DkmRespTableRow>
    }

    return <DkmRespTableMain>
        <DkmRespTableHead>
            <tr>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    nr
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    Kundenname
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    gp_id
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left md:text-right"}>
                    E-Mail
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left md:text-right"}>
                    Stundenhonorar
                </DkmRespTableHeadTh>
            </tr>
        </DkmRespTableHead>
        <tbody>
        {props.rows.map(r => renderTableRow(r))}
        </tbody>
    </DkmRespTableMain>
}




function KuHonListComp(props: Props) {

    return <div>
        < KuHonListCompTable rows={props.rows} navigate={props.navigate}/>
    </div>
}

export default KuHonListComp;