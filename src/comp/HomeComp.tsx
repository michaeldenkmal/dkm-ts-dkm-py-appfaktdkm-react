import {Link} from "wouter";

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
        </ul>
    </div>
}

export default HomeComp;