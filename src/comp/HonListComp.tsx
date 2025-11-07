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
import {createEmptyHonListSearchData, type HonListSearchData, type HonListViewModel} from "../model/hon_list_m.ts";
import {fmtGermanDate} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";

interface Props {
    rows: Array<HonListViewModel>
    searchData: HonListSearchData
    uq_searchKey: string
    navigate:(path:string) => void
    onStartSearch: (data: HonListSearchData) => void
}

let lastClickHonNr="";

interface HonListCompTableProps {
    rows: Array<HonListViewModel>
    uq_searchKey: string
    navigate:(path:string) => void
}

//                 <th class="table-head-th">Rechnungsnr</th>
//                 <th class="table-head-th">Kundenname</th>
//                 <th class="table-head-th">Betrag</th>
function HonListCompTable(props: HonListCompTableProps) {
    const rowScroller = useRowScroller();

    useLayoutEffect(()=>{
        if (lastClickHonNr) {
            rowScroller.scrollToRow(lastClickHonNr);
        }
    },[props.rows]);

    function handleOnLinkChange(honorarnr:string,url:string) {
        lastClickHonNr=honorarnr;
        props.navigate(url);
    }

    function calcTrClass(row:HonListViewModel) {
        const classes:string[] = ["hover:bg-blue-50"];
        if (lastClickHonNr == row.honorarnr) {
            classes.push("bg-green-100");
        }
        return classes.join(" ");
    }

    function handleTrMousEnter(row: HonListViewModel) {
        lastClickHonNr = row.honorarnr;
    }

    function renderTableRow(row: HonListViewModel) {
        return <DkmRespTableRow key={row.honorarnr} ref={rowScroller.registerRowRef(row.honorarnr)}
            additionalClasses={calcTrClass(row) }
            onMouseEnter={()=>handleTrMousEnter(row)}
        >
            <DkmRespTableCell label={"Honorarnr"} tdClass={"text-left"}>
                <div className={"dkm-link"}
                      onClick={()=> handleOnLinkChange(row.honorarnr,DkmFaktRouterConsts.getHonFormUrl(row.hon_float_nr,
                          props.uq_searchKey))} >
                    {row.honorarnr}</div>
            </DkmRespTableCell>
            <DkmRespTableCell label={"verrechnet am"} tdClass={"text-left"}>
                {fmtGermanDate(row.verrechnet_am)}
            </DkmRespTableCell>
            <DkmRespTableCell label={"Kundename"} tdClass={"text-left"}>
                {row.firma1}
            </DkmRespTableCell>
            <DkmRespTableCell label={"Betrag"} tdClass={"text-right"}>
                {fmtGermanNum(row.gesamtpreis ||0 )}
            </DkmRespTableCell>
            <DkmRespTableCell label={"abgerechnet"} tdClass={"text-center"}>
                {row.ist_verrechnet}
            </DkmRespTableCell>
            <DkmRespTableCell label={"weggeschickt"} tdClass={"text-center"}>
                {row.ist_weggeschickt}
            </DkmRespTableCell>
        </DkmRespTableRow>
    }

    return <DkmRespTableMain>
        <DkmRespTableHead>
            <tr>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    Honorarnr
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    verrechnet am
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-left"}>
                    Kundenname
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-right"}>
                    Betrag
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-right"}>
                    abgerechnet
                </DkmRespTableHeadTh>
                <DkmRespTableHeadTh additionalClasses={"text-right"}>
                    weggeschickt
                </DkmRespTableHeadTh>
            </tr>
        </DkmRespTableHead>
        <tbody>
        {props.rows.map(r => renderTableRow(r))}
        </tbody>
    </DkmRespTableMain>
}


interface HonListSearchProps {
    searchData: HonListSearchData
    onStartSearch: (data: HonListSearchData) => void
}

function HonListSearch(props: HonListSearchProps) {
    const [s_state, s_setState] = useState<HonListSearchData>(createEmptyHonListSearchData());
    useEffect(() => {
        if (props.searchData) {
            s_setState(props.searchData)
        }
    }, [props.searchData]);

    function handleHonNumInpChange(evt: ChangeEvent<HTMLInputElement>) {
        s_setState(
            {
                ...s_state,
                honorarnr: evt.target.value
            }
        )
    }

    function handleFirmaInpChange(evt: ChangeEvent<HTMLInputElement>) {
        s_setState(
            {
                ...s_state,
                firma: evt.target.value
            }
        )
    }

    return <DkmRespForm>
        <DkmRespFormCell>
            <label>Honorarnr</label>
            <input type="text"
                   value={s_state.honorarnr}
                   onChange={handleHonNumInpChange}
            />
        </DkmRespFormCell>
        <DkmRespFormCell>
            <label>Firma</label>
            <input type="text"
                   value={s_state.firma}
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
        <HonListSearch onStartSearch={props.onStartSearch}
                        searchData={props.searchData}
        />
        <HonListCompTable rows={props.rows} uq_searchKey={props.uq_searchKey}
                          navigate={props.navigate}/>
    </div>
}

export default RechListComp;