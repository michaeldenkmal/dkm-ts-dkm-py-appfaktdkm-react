import {Link} from "wouter";
import {DkmFaktRouterConsts} from "../dkm_fakt_router.ts";

function HomeComp() {
    return <div>
        <ul>
            <li>
                <Link className={"underline"} to="/rech_list/start">Rechnungen</Link>
            </li>
            <li>
                <Link className={"underline"} to="/hon_list/start">Honorar</Link>
            </li>
            <li>
                <Link className={"underline"} to="/hon_abr">Honorar-Abrechnung</Link>
            </li>
            <li>
                <Link className={"underline"} to={DkmFaktRouterConsts.getKuHonListUrl()}>Kunden - Honorare . Verwaltung</Link>
            </li>
        </ul>
    </div>
}

export default HomeComp;