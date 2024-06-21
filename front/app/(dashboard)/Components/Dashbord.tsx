"use client"
import Image from "next/image"
import logo from "@/public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "@/public/assets/images/google-play.svg"
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import userPic from "@/public/assets/images/userPic.png"
import { Bell, Faq, Home, Params, TransCash, User } from "./icons";


type Props = {
    children: ReactNode;
};

function Dashbord({ children }: Props) {
const [href, setHref] = useState("")

useEffect(()=>{
    setHref(window.location.href.substring(22, window.location.href.length))
    console.log(window.location.href.substring(22, window.location.href.length))
}, [])

    return (
        <>
            <div className="relative text-[19px] bg-bodyBg text-white overflow-hidden h-[100vh] w-[100vw]">
                <div className="absolute left-0 top-0 bottom-0 w-60 z-10">
                    <ul className="py-2 text-textGray bg-white px-8 flex-col flex gap-6 h-full">
                    <Image alt="logo" className="w-[143px]" src={logo}></Image>
                        <li><Link className={`${href == "dashboard" || href == "verify" ? 'text-primary' : ''} flex items-center gap-3`} href={'dashboard'}><Home f={`${href == "dashboard" || href == "verify" ? '#1877F2' : '#606060'}`}></Home>Dashboard</Link></li>
                        <li><Link className={`${href == "transactions" ? 'text-primary' : ''} flex items-center gap-3`} href={'transactions'}><TransCash f={`${href == "transactions" ? '#1877F2' : '#606060'}`}></TransCash>Transactions</Link></li>
                        <li><Link className={`${href == "profil" ? 'text-primary' : ''} flex items-center gap-3`} href={'profil'}><User f={`${href == "profil" ? '#1877F2' : '#606060'}`}></User>Profil</Link></li>
                        <li><Link className={`${href == "params" ? 'text-primary' : ''} flex items-center gap-3`} href={'params'}><Params f={`${href == "params" ? '#1877F2' : '#606060'}`}></Params>Paramètres</Link></li>
                        <li><Link className={`${href == "faq" ? 'text-primary' : ''} flex items-center gap-3`} href={'faq'}><Faq f={`${href == "faq" ? '#1877F2' : '#606060'}`}></Faq>FAQ</Link></li>
                    </ul>
                </div>
                <div className="flex bg-white p-2 items-center absolute top-0 h-24 pl-56 w-full">
                    <div className="flex items-center gap-4 bg-white w-full p-2 text-primary rounded-lg justify-end">
                        <Bell></Bell>
                        <Image alt="belle femme" src={userPic}></Image>
                    </div>
                </div>
                <div className="pl-60 pt-24 relative w-[100vW] h-[100vh] overflow-y-scroll text-textGray">
                    {children}
                </div>
            </div >
        </>
    )
}

export default Dashbord