// src/layouts/AppShell.tsx
import type {ReactNode} from "react";
import HtmlViewer from "../dkm_comps/HtmlViewerComp.tsx";
import {useGlobalEvent} from "../dkm_comps/useGlobalEvent.tsx";
import {DKM_ERROR_EVENT} from "../dkm_comps/global_event_util.ts";


type Props = {
    children: ReactNode
    menu: ReactNode
    sidebar?: ReactNode
};

export default function BaseLayout(props:Props) {


    const globalDkmErrorData = useGlobalEvent(DKM_ERROR_EVENT);

    function renderSideBar() {
        if (props.sidebar) {
            return (
                <div id={"sidebar"}>
                    {props.sidebar}
                </div>
            )
        }
        return null;
    }

    function renderHtmlViewer() {
        if (!globalDkmErrorData) {
            return null;
        }
        return <HtmlViewer html={globalDkmErrorData.msg}/>
    }

    return (
        <>
        <div id={"menu"}>
            {props.menu}
        </div>
            {renderSideBar()}
        <div id={"content"}>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
                <header className="border-b p-4">Dkm Fakturierung</header>
                <main className="p-1">{props.children}</main>
                {renderHtmlViewer()}
                <footer className="border-t p-1 text-sm">© {new Date().getFullYear()}</footer>
            </div>

        </div>
        </>
    )
}

