/* eslint-disable react/no-unescaped-entities */
"use client"
import Image from "next/image"
import logo from "@/public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "@/public/assets/images/google-play.svg"
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import userPic from "@/public/assets/images/userPic.png"
import { Bell, Faq, Home, Logout, Params, TransCash, User } from "./icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';
import { useRouter, usePathname } from "next/navigation";


type Props = {
    children: ReactNode;
};

function Dashbord({ children }: Props) {
const [href, setHref] = useState<string[]>([])
const [showTrans, setShowTrans] = useState(false)
const apiUrl = process.env.NEXT_PUBLIC_APIURL
const router = useRouter()
const pathname = usePathname()
const {data : session} = useSession()
useEffect(()=>{
    setHref(pathname.split('/'))
    console.log(pathname.split('/'));
}, [pathname])



const logout = ()=>{
    axios.post(`${apiUrl}/token/revoke`, {'user' : session?.user.token}, {headers : {Authorization :`Bearer ${session?.user.token}`}}).then((resp)=>{
        if (resp.status == 200) {
            signOut()
        }
    })
}

    return (
        <>
            <div className="relative text-[19px] bg-bodyBg text-white overflow-hidden h-[100vh] w-[100vw]">
                <div className="absolute left-0 top-0 bottom-0 w-60 z-20">
                    <ul className="py-2 text-textGray bg-white px-8 flex-col flex gap-6 h-full border-r">
                    <Image alt="logo" className="w-[143px]" src={logo}></Image>
                        <li><Link className={`${href[1] == "dashboard" || href[1] == "verify" ? 'text-primary' : ''} flex items-center gap-3`} href={'/dashboard'}><Home f={`${href[1] == "dashboard" || href[1] == "verify" ? '#1877F2' : '#606060'}`}></Home>Dashboard</Link></li>
                        <li> <button onClick={()=>{setShowTrans(!showTrans)}} className={`${href[1] == "transactions" ? 'text-primary' : ''} flex items-center gap-3`}><TransCash f={`${href[1] == "transactions" ? '#1877F2' : '#606060'}`} ></TransCash>Transactions</button>
                        <ul className={`${showTrans ? 'h-24 mt-4' : 'h-0'} ml-8 text-sm flex flex-col gap-2 duration-500 overflow-hidden`}>
                            <li className={`${href[1] == "transactions" && href[2] == 'mobile' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/transactions/mobile'}>Transfert par mobile</Link></li>
                            <li className={`${href[1] == "transactions" && href[2] == 'carte' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/transactions/carte'}>Transfert par carte</Link></li>
                            <li className={`${href[1] == "transactions" && href[2] == 'historique' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/transactions/historique'}>Historique</Link></li>
                        </ul>
                        </li>
                        <li><Link className={`${href[1] == "profil" ? 'text-primary' : ''} flex items-center gap-3`} href={'/profil'}><User f={`${href[1] == "profil" ? '#1877F2' : '#606060'}`}></User>Profil</Link></li>
                        <li><Link className={`${href[1] == "params" ? 'text-primary' : ''} flex items-center gap-3`} href={'/params'}><Params f={`${href[1] == "params" ? '#1877F2' : '#606060'}`}></Params>Paramètres</Link></li>
                        <li><Link className={`${href[1] == "faq" ? 'text-primary' : ''} flex items-center gap-3`} href={'/faq'}><Faq f={`${href[1] == "faq" ? '#1877F2' : '#606060'}`}></Faq>FAQ</Link></li>
                        <li className="absolute bottom-5 text-base"><button className={`${href[1] == "faq" ? 'text-primary' : ''} flex items-center gap-3`} onClick={()=>{logout()}}><Logout f={`${href[1] == "faq" ? '#1877F2' : '#606060'}`}></Logout>Déconnexion</button></li>
                    </ul>
                </div>
                <div className="flex bg-white p-2 items-center absolute top-0 h-24 pl-56 w-full z-10">
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