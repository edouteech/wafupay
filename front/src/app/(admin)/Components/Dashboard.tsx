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
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";


type Props = {
    children: ReactNode;
};

function Dashbord({ children }: Props) {
    const [href, setHref] = useState<string[]>([])
    const [showTrans, setShowTrans] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()
    useEffect(() => {
        console.log(pathname);
        setHref(pathname.split('/'))
    }, [pathname])

    // useEffect(()=>{
    //     if (session) {
    //         if (session.user.role != 'admin') {
    //             window.location.href = '/dashboard'
    //         }
    //     }
    // },[session])

    const logout = () => {
        axios.post(`${apiUrl}/token/revoke`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
            if (resp.status == 200) {
                signOut()
            }
        })
    }

    return (
        <>
            <div className="relative text-[19px] bg-bodyBg text-white overflow-hidden h-[100vh] w-[100vw]">
                <div className="absolute left-0 top-0 bottom-0 w-64 z-20 xs:w-32 xs:bottom-auto">
                    <div className="p-4 xs:p-2 bg-primary">
                        <Image alt="logo" className="w-[143px] m-auto bg-white rounded p-2" src={logo}></Image>
                    </div>
                    <ul className="py-2 text-textGray bg-white flex-col flex gap-6 h-full border-r border-primary px-2 xs:hidden">
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-dashboard" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-dashboard'}><Home f={`${href[1] == "admin-dashboard" ? '#1877F2' : '#606060'}`}></Home>Tableau de bord</Link></li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-users" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-users'}><Users f={`${href[1] == "admin-users" ? '#1877F2' : '#606060'}`}></Users>Utilisateurs</Link></li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-suppliers" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-suppliers'}><Users f={`${href[1] == "admin-suppliers" ? '#1877F2' : '#606060'}`}></Users>Fournisseurs</Link></li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-providers" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-providers'}><Users f={`${href[1] == "admin-providers" ? '#1877F2' : '#606060'}`}></Users>Operateurs</Link></li>
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-countries" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-countries'}><Users f={`${href[1] == "admin-countries" ? '#1877F2' : '#606060'}`}></Users>Pays</Link></li>
                        {/* <li className="text-gray-700 font-semibold relative"> <button onClick={() => { setShowTrans(!showTrans) }} className={`${href[1] == "admin-configs" ? 'text-primary' : ''} flex items-center gap-3`}><UserConfig f={`${href[1] == "admin-configs" ? '#1877F2' : '#606060'}`} ></UserConfig>Configurations</button>
                            <span className="duration-500 absolute right-5 top-0">
                                {showTrans ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <ul className={`${showTrans ? 'h-16 mt-4' : 'h-0'} ml-8 text-sm flex flex-col gap-2 duration-500 overflow-hidden`}>
                                <li className={`${href[1] == "admin-configs" && href[2] == 'countries' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/countries'}>Gestion des pays</Link></li>
                                <li className={`${href[1] == "admin-configs" && href[2] == 'suppliers' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/suppliers'}>Fournisseurs</Link></li>
                            </ul>
                        </li> */}
                        <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-transactions" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-transactions'}><DocPaper f={`${href[1] == "admin-transactions" ? '#1877F2' : '#606060'}`}></DocPaper>Transactions</Link></li>
                        <li className="absolute bottom-5 text-base"><button className={`flex items-center gap-3`} onClick={() => { logout() }}><Logout f={`${href[1] == "faq" ? '#1877F2' : '#606060'}`}></Logout>Déconnexion</button></li>
                    </ul>
                </div>
                <div className="flex bg-white p-2 items-center border-b border-primary absolute top-0 h-[6.2rem] pl-56 w-full z-10 xs:hidden">
                    <div className="flex items-center gap-4 bg-white w-full p-2 text-primary rounded-lg justify-end">
                        <Bell></Bell>
                        <Image alt="belle femme" src={userPic}></Image>
                    </div>
                </div>
                <div className="flex bg-white xs:bg-primary p-2 items-center border-b border-primary absolute top-0 h-[4.5rem] pl-56 w-full z-10">
                    <div className="flex items-center gap-4 w-full p-2 text-primary rounded-lg justify-end">
                        <button onClick={()=>{setIsOpen(!isOpen)}}><Menu className="text-white w-10 h-10"></Menu></button>
                    </div>
                </div>
                <ul className={`${isOpen ? 'h-72 py-2' : 'h-0'} text-textGray bg-white flex-col flex gap-6 border-r border-primary px-2 mt-20 duration-500 overflow-hidden`}>
                    <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-dashboard" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-dashboard'}><Home f={`${href[1] == "admin-dashboard" ? '#1877F2' : '#606060'}`}></Home>Tableau de bord</Link></li>
                    <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-users" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-users'}><Users f={`${href[1] == "admin-users" ? '#1877F2' : '#606060'}`}></Users>Utilisateurs</Link></li>
                    <li className="text-gray-700 font-semibold relative"> <button onClick={() => { setShowTrans(!showTrans) }} className={`${href[1] == "admin-configs" ? 'text-primary' : ''} flex items-center gap-3`}><UserConfig f={`${href[1] == "admin-configs" ? '#1877F2' : '#606060'}`} ></UserConfig>Configurations</button>
                        <span className="duration-500 absolute right-5 top-0">
                            {showTrans ? <ChevronDown /> : <ChevronRight />}
                        </span>
                        <ul className={`${showTrans ? 'h-16 mt-4' : 'h-0'} ml-8 text-sm flex flex-col gap-2 duration-500 overflow-hidden`}>
                            <li className={`${href[1] == "admin-configs" && href[2] == 'countries' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/countries'} className="">Gestion des pays</Link></li>
                            <li className={`${href[1] == "admin-configs" && href[2] == 'suppliers' ? 'text-primary' : ''} list-disc hover:text-primary`}><Link href={'/admin-configs/suppliers'} className="">Fournisseurs</Link></li>
                        </ul>
                    </li>
                    <li className="text-gray-700 font-semibold"><Link className={`${href[1] == "admin-transactions" ? 'text-primary' : ''} flex items-center gap-3`} href={'/admin-transactions'}><DocPaper f={`${href[1] == "admin-transactions" ? '#1877F2' : '#606060'}`}></DocPaper>Transactions</Link></li>
                    <li className=""><button className={`flex items-center gap-3`} onClick={() => { logout() }}><Logout f={`${href[1] == "faq" ? '#1877F2' : '#606060'}`}></Logout>Déconnexion</button></li>
                </ul>
                <div className="pl-64 pt-24 relative w-[100vW] h-[100vh] xs:px-0 xs:pt-14 overflow-y-scroll text-textGray">
                    {children}
                </div>
            </div >
        </>
    )
}

export default Dashbord