import './App.css'
import {Route} from "wouter";
import RechListCtrl from "./ctrl/RechListCtrl.tsx";

import "./index.css";
import RechFormCtrl from "./ctrl/RechFormCtrl.tsx";
import HonListCtrl from "./ctrl/HonListCtrl.tsx";
import HonFormCtrl from "./ctrl/HonFormCtrl.tsx";
import HomeCtrl from "./ctrl/HomeCtrl.tsx";
import {useGlobalEvent} from "./dkm_comps/useGlobalEvent.tsx";
import {DKM_ERROR_EVENT} from "./dkm_comps/global_event_util.ts";
import HtmlViewer from "./dkm_comps/HtmlViewerComp.tsx";
import HonAbrCtrl from "./ctrl/HonAbrCtrl.tsx";




function App() {
    const globalDkmErrorData = useGlobalEvent(DKM_ERROR_EVENT);
    function renderHtmlViewer() {
        if (!globalDkmErrorData) {
            return null;
        }
        return <HtmlViewer html={globalDkmErrorData.msg}/>
    }

    return (
        < >
            {renderHtmlViewer()}
            {/*<nav style={{marginBottom: "1rem"}}>*/}
            {/*    <Link href="/rech_list/start">Rechnungen</Link>*/}
            {/*</nav>*/}
            <Route path={"/"} ><HomeCtrl/></Route>
            <Route path="/rech_list/:search_key" >
                {params =>
                   <RechListCtrl searchKey={params.search_key}/>
                }
            </Route>
            <Route path="/rech_form/:vnr/:uq_search_key">
                {params =>
                    <RechFormCtrl vnr={parseFloat(params.vnr)} unique_search_key={params.uq_search_key}/>}
            </Route>
            <Route path="/hon_list/:search_key" >
                {params =>
                    <HonListCtrl searchKey={params.search_key}/>
                }
            </Route>
            <Route path="/hon_form/:hon_float_nr/:uq_search_key">
                {params =>
                    <HonFormCtrl hon_float_nr={parseFloat(params.hon_float_nr)} unique_search_key={params.uq_search_key}/>}
            </Route>
            <Route path="/hon_abr" >
                <HonAbrCtrl/>
            </Route>
            {/* <Route path="/:rest*">{() => <h2>404 – not found</h2>}</Route> */}
            </>
    )
}

export default App
