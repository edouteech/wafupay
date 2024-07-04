/* eslint-disable react/no-unescaped-entities */
"use client"
import Image from "next/image"
import logo from "@/public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "@/public/assets/images/google-play.svg"
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import userPic from "@/public/assets/images/userPic.png"
import { Bell, DocPaper, Faq, Home, Logout, Params, Stat, TransCash, User, UserConfig, Users } from "../../(dashboard)/Components/icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react';
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";


type Props = {
    children: ReactNode;
};

function Dashbord({ children }: Props) {
    const [href, setHref] = useState<string[]>([])
    const [showTrans, setShowTrans] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const { data: session } = useSession()
    useEffect(() => {
        let ref = window.location.href.split('/')
        setHref(ref)
        console.log(window.location.href.substring(22, window.location.href.length))
    }, [window.location.href])

    useEffect(()=>{
        if (session) {
            if (session.user.role != 'admin') {
                window.location.href = '/dashboard'
            }
        }
    },[session])

    const logout = () => {
        axios.post(`${apiUrl}/token/revoke`, { 'user': session?.user.token }, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
            if (resp.status == 200) {
                signOut()
            }
        })
    }

    return (
        <>
            <div className="relative text-[19px] bg-bodyBg text-white overflow-hidden h-[100vh] w-[100vw]">
                <div className="absolute left-0 top-0 bottom-0 w-64 z-20">
                    <div className="p-4 bg-primary">
                        <Image alt="logo" className="w-[143px] m-auto bg-white rounded p-2" src={logo}></Image>
                    </div>
                    <ul className="py-2 text-textGray bg-white flex-col flex gap-6 h-full border-r border-primary px-2">
                        <li className="text-gray-700 font-semibold"><Link className={`${href[3] == "admin-dashboard" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-dashboard'}><Home f={`${href[3] == "admin-dashboard" ? '#1877F2' : '#606060'}`}></Home>Tableau de bord</Link></li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[3] == "admin-users" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-users'}><Users f={`${href[3] == "admin-users" ? '#1877F2' : '#606060'}`}></Users>Utilisateurs</Link></li>
                        <li className="text-gray-700 font-semibold relative"> <button onClick={() => { setShowTrans(!showTrans) }} className={`${href[3] == "admin-configs" ? 'text-primary' : ''} flex items-center gap-3`}><UserConfig f={`${href[3] == "admin-configs" ? '#1877F2' : '#606060'}`} ></UserConfig>Configurations</button>
                            <span className="duration-500 absolute right-5 top-0">
                                {showTrans ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <ul className={`${showTrans ? 'h-16 mt-4' : 'h-0'} ml-8 text-sm flex flex-col gap-2 duration-500 overflow-hidden`}>
                                <li className={`${href[3] == "admin-configs" && href[4] == 'countries' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/countries'}>Gestion des pays</Link></li>
                                <li className={`${href[3] == "admin-configs" && href[4] == 'suppliers' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/suppliers'}>Fournisseurs</Link></li>
                            </ul>
                        </li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[3] == "admin-transactions" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-transactions'}><DocPaper f={`${href[3] == "admin-transactions" ? '#1877F2' : '#606060'}`}></DocPaper>Transactions</Link></li>
                        <li className="absolute bottom-5 text-base"><button className={`flex items-center gap-3`} onClick={() => { logout() }}><Logout f={`${href[3] == "faq" ? '#1877F2' : '#606060'}`}></Logout>Déconnexion</button></li>
                    </ul>
                </div>
                <div className="flex bg-white p-2 items-center border-b border-primary absolute top-0 h-[6.2rem] pl-56 w-full z-10">
                    <div className="flex items-center gap-4 bg-white w-full p-2 text-primary rounded-lg justify-end">
                        <Bell></Bell>
                        <Image alt="belle femme" src={userPic}></Image>
                    </div>
                </div>
                <div className="pl-64 pt-24 relative w-[100vW] h-[100vh] overflow-y-scroll text-textGray">
                    {children}
                </div>
            </div >
        </>
    )
}

export default Dashbord