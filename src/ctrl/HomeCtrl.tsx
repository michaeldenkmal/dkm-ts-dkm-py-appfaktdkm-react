import BaseLayout from "../dkm_comps/BaseLayout.tsx";
import HomeComp from "../comp/HomeComp.tsx";
import BaseMenuBar from "../dkm_comps/BaseMenuBar.tsx";
import {MITM_HON_LIST, MITM_RECH_LIST} from "../dkm_fakt_menu.ts";

export default function HomeCtrl() {
    function renderMenu() {
        return <BaseMenuBar items={[MITM_HON_LIST, MITM_RECH_LIST]}></BaseMenuBar>
    }
    return <BaseLayout menu={renderMenu()} sidebar={null}>
        <HomeComp/>
    </BaseLayout>

}