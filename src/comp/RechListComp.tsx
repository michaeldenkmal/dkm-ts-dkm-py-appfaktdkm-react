import {createEmptyRechListSearchData, type RechListSearchData, type RechListViewModel} from "../model/rech_list_m.ts";
import DkmRespTableMain from "../dkmtags/DkmRespTableMain.tsx";
import DkmRespTableHead from "../dkmtags/DkmRespTableHead.tsx";
import DkmRespTableHeadTh from "../dkmtags/DkmRespTableHeadTh.tsx";
import DkmRespTableRow from "../dkmtags/DkmRespTableRow.tsx";
import DkmRespTableCell from "../dkmtags/DkmRespTableCell.tsx";
import DkmRespForm from "../dkmtags/DkmRespForm.tsx";
import DkmRespFormCell from "../dkmtags/DkmRespFormCell.tsx";
import {type ChangeEvent, useEffect, useLayoutEffect, useState} from "react";
import DkmButton from "../dkmtags/DkmButton.tsx";
import {fmtGermanNum} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";
import {useRowScroller} from "../dkm_comps/useRowScroller.tsx";

interface Props {
    rows: Array<RechListViewModel>
    searchData: RechListSearchData
    uq_searchKey: string
    navigate:(path:string) => void
    onStartSearch: (data: RechListSearchData) => void
}

let lastClickRechNr = 0;

interface RechListCompTableProps {
    rows: Array<RechListViewModel>
    uq_searchKey: string
    navigate:(path:string) => void
}

//                 <th class="table-head-th">Rechnungsnr</th>
//                 <th class="table-head-th">Kundenname</th>
//                 <th class="table-head-th">Betrag</th>
function RechListCompTable(props: RechListCompTableProps) {
    const rowScroller = useRowScroller();



    useLayoutEffect(()=>{
        if (lastClickRechNr) {
            rowScroller.scrollToRow(lastClickRechNr);
        }
    },[props.rows]);

    function handleOnLinkChange(rech_pk:number,url:string) {
        lastClickRechNr=rech_pk;
        props.navigate(url);
    }

    function calcTrClass(row:RechListViewModel) {
        const classes:string[] = ["hover:bg-blue-50"];
        if (lastClickRechNr == row.rech_pk) {
            classes.push("bg-green-100");
        }
        return classes.join(" ");
    }

    function handleTrMousEnter(row: RechListViewModel) {
        lastClickRechNr = row.rech_pk;
    }

    function renderTableRow(row: RechListViewModel) {
        return <DkmRespTableRow key={row.rech_pk} ref={rowScroller.registerRowRef(row.rech_pk)}
            additionalClasses={calcTrClass(row) }
            onMouseEnter={()=>handleTrMousEnter(row)}
        >
            <DkmRespTableCell label={"Rechnungsnr"} tdClass={"text-left"}>
                <div className={"dkm-link"}
                      onClick={()=> handleOnLinkChange(row.rech_pk,DkmFaktRouterConsts.getRechFormUrl(row.rech_pk,props.uq_searchKey))} >
                    {row.rech_num}</div>
            </DkmRespTableCell>
            <DkmRespTableCell label={"Kundename"} tdClass={"text-left"}>
                {row.firma1}
            </DkmRespTableCell>
            <DkmRespTableCell label={"Gesamtbetrag"} tdClass={"text-right"}>
                {fmtGermanNum(row.gesamt_betrag)}
            </DkmRespTableCell>
        </DkmRespTableRow>
    }

    return <DkmRespTableMain>
        <DkmRespTableHead>
            <tr>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    Rechnungsnr
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    Kundenname
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-right"}>
                    Betrag
                </DkmRespTableHeadTh>
            </tr>
        </DkmRespTableHead>
        <tbody>
        {props.rows.map(r => renderTableRow(r))}
        </tbody>
    </DkmRespTableMain>
}


interface RechListSearchProps {
    searchData: RechListSearchData
    onStartSearch: (data: RechListSearchData) => void
}

function RechListSearch(props: RechListSearchProps) {
    const [s_state, s_setState] = useState<RechListSearchData>(createEmptyRechListSearchData());
    useEffect(() => {
        if (props.searchData) {
            s_setState(props.searchData)
        }
    }, [props.searchData]);

    function handleRechNumInpChange(evt: ChangeEvent<HTMLInputElement>) {
        s_setState(
            {
                ...s_state,
                search_expr_rechnum: evt.target.value
            }
        )
    }

    function handleFirmaInpChange(evt: ChangeEvent<HTMLInputElement>) {
        s_setState(
            {
                ...s_state,
                search_expr_firma: evt.target.value
            }
        )
    }

    return <DkmRespForm>
        <DkmRespFormCell>
            <label>Rechnungsnr</label>
            <input type="text"
                   value={s_state.search_expr_rechnum}
                   onChange={handleRechNumInpChange}
            />
        </DkmRespFormCell>
        <DkmRespFormCell>
            <label>Firma</label>
            <input type="text"
                   value={s_state.search_expr_firma}
                   onChange={handleFirmaInpChange}
            />
        </DkmRespFormCell>
        <DkmRespFormCell>
            <DkmButton onClick={() => props.onStartSearch(s_state)} defaultBtn={true}>
                suchen
            </DkmButton>
        </DkmRespFormCell>
    </DkmRespForm>
}

function RechListComp(props: Props) {

    return <div>
        <RechListSearch onStartSearch={props.onStartSearch}
                        searchData={props.searchData}
        />
        <RechListCompTable rows={props.rows} uq_searchKey={props.uq_searchKey} navigate={props.navigate}/>
    </div>
}

export default RechListComp;