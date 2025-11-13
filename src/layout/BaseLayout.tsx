// src/layouts/AppShell.tsx
import type {ReactNode} from "react";
import {Link} from "wouter";


type Props = {
    children: ReactNode
    menu: ReactNode
    sidebar?: ReactNode
};

export default function BaseLayout(props:Props) {



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


    return (
        <>
        <div id={"menu"}>
            {props.menu}
        </div>
            {renderSideBar()}
        <div id={"content"}>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto] content">
                <header className="border-b p-4"><Link  className={"underline"} to={"/"}>Dkm-Fakturierung -  Home</Link></header>
                <main className="p-2">{props.children}</main>
                <footer className="border-t p-1 text-sm">© {new Date().getFullYear()}</footer>
            </div>

        </div>
        </>
    )
}

