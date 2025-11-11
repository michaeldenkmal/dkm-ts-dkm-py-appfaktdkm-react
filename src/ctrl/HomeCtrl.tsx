import BaseLayout from "../layout/BaseLayout.tsx";
import HomeComp from "../comp/HomeComp.tsx";
import BaseMenuBar from "../layout/BaseMenuBar.tsx";
import {MITM_HON_LIST, MITM_RECH_LIST} from "../layout/dkm_fakt_menu.ts";

export default function HomeCtrl() {
    function renderMenu() {
        return <BaseMenuBar items={[MITM_HON_LIST, MITM_RECH_LIST]}></BaseMenuBar>
    }
    return <BaseLayout menu={renderMenu()} sidebar={null}>
        <HomeComp/>
    </BaseLayout>

}