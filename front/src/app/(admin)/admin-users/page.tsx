/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Eye, EyeOff, PenLine, Trash } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";
import Image from "next/image";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const { data: session } = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [admins, setAdmins] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number[]>([])
    const [prev, setPrev] = useState('')
    const [next, setNext] = useState('')


    //################################## MOUNTED ################################//
    useEffect(() => {
        if (session && !auth.headers.Authorization) {
            setAuth({ headers: { Authorization: `Bearer ${session.user?.token}` } })
            axios.get(`${apiUrl}/admin/users`, { headers: { Authorization: `Bearer ${session.user?.token}` } }).then((resp) => {
                let d = resp.data.data
                setAdmins(d.admins)
                setUsers(d.users.data)
                setUsers(resp.data.data.users.data)
                let tab = []
                for (let i = 0; i < Math.ceil(resp.data.data.users.total / resp.data.data.users.per_page); i++) {
                    tab[i] = i + 1
                }
                setPageCount(tab)
                setPrev(resp.data.data.users.prev_page_url)
                setNext(resp.data.data.users.next_page_url)
            })
        }
    }, [session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const changePage = (page: number) => {
        axios.get(`${apiUrl}/admin/users?page=${page}`, auth).then((resp) => {
            setUsers(resp.data.data.users.data)
            let tab = []
            for (let i = 0; i < Math.ceil(resp.data.data.users.total / resp.data.data.users.per_page); i++) {
                tab[i] = i + 1
            }
            setPage(page)
            setPageCount(tab)
            setPrev(resp.data.data.users.prev_page_url)
            setNext(resp.data.data.users.next_page_url)
        })
    }

    const prevOrNext = (link: string) => {
        if (link) {
            axios.get(`${link}`, auth).then((resp) => {
                setUsers(resp.data.data.users.data)
                let tab = []
                for (let i = 0; i < Math.ceil(resp.data.data.users.total / resp.data.data.users.per_page); i++) {
                    tab[i] = i + 1
                }
                setPage(resp.data.data.users.current_page)
                setPageCount(tab)
                setPrev(resp.data.data.users.prev_page_url)
                setNext(resp.data.data.users.next_page_url)
            })
        } else {
            return;
        }
    }


    //################################## HTML ####################################//

    return (
        //  Ed0ut3ch
        <>
            <Dashbord>
                <div>
                    <div className="mx-32 my-12">
                        <h2 className="text-center text-[#8280FF] font-semibold mb-8">Liste des utilisateurs</h2>
                        <table className="w-full">
                            <thead className="bg-white text-left text-base font-semibold">
                                <tr>
                                    <th className="py-2">Nom et prénom(s)</th>
                                    <th className="py-2">Statut</th>
                                    <th className="py-2">Date de création</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-base text-black">
                                {admins.map((ad, i) => (
                                    <tr className="text-left text-sm" key={i}>
                                        <td className="p-1 pl-4">{ad.first_name} {ad.last_name}</td>
                                        <td className="p-1 ">Admin</td>
                                        <td className="p-1 pl-6">{ad.created_at.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td className="flex gap-2 p-1"><PenLine className="w-4 h-4"></PenLine><Trash className="w-4 h-4"></Trash></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mx-8 mt-12 mb-24">
                        <h2 className="text-center text-[#8280FF] font-semibold mb-8">Liste des utilisateurs</h2>
                        <table className="w-full">
                            <thead className="bg-white text-left text-base font-semibold">
                                <tr>
                                    <th className="py-2">Nom et prénom(s)</th>
                                    <th className="py-2">Téléphone</th>
                                    <th className="py-2 pl-12">Email</th>
                                    <th className="p-1 pl-4">Statut</th>
                                    <th className="py-2">Date de création</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-base text-black">
                                {users.map((us, i) => (
                                    <tr className="text-left text-sm" key={i}>
                                        <td className="p-1 pl-4">{us.first_name} {us.last_name}</td>
                                        <td className="p-1 flex items-center gap-2">
                                            {us.phone_num && (
                                                <span>({us.phone_num.substring(0, 4)})</span>
                                            )}
                                            {us.phone_num ? us.phone_num.substring(4, us.phone_num.length) : ""}
                                        </td>
                                        <td className="p-1 pl-8">{us.email}</td>
                                        <td className={`${us.is_verified == "0" ? 'text-red-500' : 'text-green-500'} p-1`}>{us.is_verified == "0" ? 'Non vérifié' : "Vérifier"}</td>
                                        <td className="p-1 pl-6">{us.created_at.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td className="flex gap-2 p-1"><PenLine className="w-4 h-4"></PenLine><Trash className="w-4 h-4"></Trash></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex float-end mt-8 gap-3 items-center">
                            <button className="text-primary" onClick={() => { prevOrNext(prev) }}>
                                <ChevronLeft></ChevronLeft>
                            </button>
                            <div className="flex gap-2">
                                {pageCount.map((btn, i) => (
                                    <button className={`${page == btn ? 'text-white bg-primary' : ' text-primary'} h-8 w-8 rounded`} onClick={() => { changePage(btn) }} key={i}>{btn}</button>
                                ))}
                            </div>
                            <button className="flex gap-1 text-primary" onClick={() => { prevOrNext(next) }}>
                                Suivant <ChevronRight></ChevronRight>
                            </button>
                        </div>
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard