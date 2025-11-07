import './App.css'
import {Route} from "wouter";
import RechListCtrl from "./ctrl/RechListCtrl.tsx";

import "./index.css";
import RechFormCtrl from "./ctrl/RechFormCtrl.tsx";
import HonListCtrl from "./ctrl/HonListCtrl.tsx";




function App() {
    return (
        <div >
            {/*<nav style={{marginBottom: "1rem"}}>*/}
            {/*    <Link href="/rech_list/start">Rechnungen</Link>*/}
            {/*</nav>*/}
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
            <Route path="/hon_form/:honorarnr/:uq_search_key">
                {params =>
                    <HonFormCtrl vnr={parseFloat(params.vnr)} unique_search_key={params.uq_search_key}/>}
            </Route>
            {/* <Route path="/:rest*">{() => <h2>404 – not found</h2>}</Route> */}
        </div>
    )
}

export default App
