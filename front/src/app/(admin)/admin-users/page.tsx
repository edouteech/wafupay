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
    const rootUrl = process.env.NEXT_PUBLIC_ROOTURL
    const router = useRouter()
    const { data: session } = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [admins, setAdmins] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [curentUser, setCurrentUser] = useState<any>({})
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
    const viewUser = (id: string) => {
        axios.get(`${apiUrl}/admin/users/${id}`, { headers: { Authorization: `Bearer ${session?.user?.token}` } }).then((response) => {
            let infos = response.data.data
            setCurrentUser(infos)
            console.log("response ", response)
        })
    }
    const handleVerified = (id: string) => {
        axios.post(`${apiUrl}/admin/activate-account/${id}`, {activate: true}, { headers: { Authorization: `Bearer ${session?.user?.token}` } }).then((response) => {
            console.log("response ", response)
        })
    }

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
        <>
            <Dashbord>
                <div>
                    <div className="mx-32 my-12 xs:mx-2 w-auto xs:my-0">
                        <h2 className="text-center text-[#8280FF] font-semibold mb-8">Liste des Admin</h2>
                        <table className="w-full min-w-full xs:w-auto">
                            <thead className="bg-white text-left text-base font-semibold">
                                <tr>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Nom et prénom(s)</th>
                                    <th className="py-2">Statut</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-base text-black">
                                {admins.map((ad, i) => (
                                    <tr className="text-left text-sm" key={i}>
                                        <td className="p-1 pl-6">{ad.created_at.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td className="p-1 pl-4">{ad.first_name} {ad.last_name}</td>
                                        <td className="p-1 ">Admin</td>
                                        <td className="flex gap-2 p-1">
                                            <Eye className="w-4 h-4"></Eye>
                                            <PenLine className="w-4 h-4"></PenLine>
                                            <Trash className="w-4 h-4"></Trash>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mx-8 mt-12 mb-24 xs:mx-2">
                        <h2 className="text-center text-[#8280FF] font-semibold mb-8">Liste des utilisateurs</h2>
                        <table className="w-full xs:w-auto border">
                            <thead className="bg-white text-left text-base font-semibold">
                                <tr>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Nom et prénom(s)</th>
                                    <th className="p-2">Téléphone</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Statut</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-base text-black">
                                {users.map((user, i) => (
                                    <tr className="text-left text-sm" key={i}>
                                        <td className="p-2">{user.created_at.substring(0, 10).split("-").reverse().join("-")}</td>
                                        <td className="p-2">{user.first_name} {user.last_name}</td>
                                        <td className="p-2flex items-center gap-2">
                                            {user.phone_num && (
                                                <span>({user.phone_num.substring(0, 4)})</span>
                                            )}
                                            {user.phone_num ? user.phone_num.substring(4, user.phone_num.length) : ""}
                                        </td>
                                        <td className="p-2">{user.email}</td>
                                        <td className={`${user.is_verified == "0" ? 'text-red-500' : 'text-green-500'} p-1`}>{user.is_verified == "0" ? 'Non vérifié' : "Vérifier"}</td>
                                        <td className="flex gap-2 p-1">
                                            <Eye className="w-4 h-4 text-primary" onClick={() => { viewUser(user.id) }}></Eye>
                                            <PenLine className="w-4 h-4 text-cyan-500"></PenLine>
                                            <Trash className="w-4 h-4 text-red-500"></Trash>
                                        </td>
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

                    {curentUser.id && (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                            <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-3 text-primary">
                                        Details de l'utilisateur
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="">
                                            <div className="flex gap-2 mb-1">
                                                <h5 className="font-bold ">Nom et prénom :</h5>
                                                <p className="italic font-light">{curentUser.first_name} {curentUser.last_name}</p>
                                            </div>
                                            <div className="flex gap-2 mb-1">
                                                <h5 className="font-bold ">Email :</h5>
                                                <p className="italic font-light">{curentUser.email}</p>
                                            </div>
                                            <div className="flex gap-2 mb-1">
                                                <h5 className="font-bold ">Téléphone :</h5>
                                                <p className="italic font-light">{curentUser.phone_num}</p>
                                            </div>
                                            <div className="flex gap-2 mb-1">
                                                <h5 className="font-bold ">Pays :</h5>
                                                <p className="italic font-light">{curentUser.country.slug}</p>
                                            </div>
                                            <div className="flex gap-2 mb-1">
                                                <h5 className="font-bold ">Date :</h5>
                                                <p className="italic font-light">{formatDate(curentUser.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <h5 className="font-bold">Pièce d'identité</h5>
                                            <Image src={`${rootUrl}/storage/${curentUser.id_card}`} alt="avatar" width={200} height={200} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button className="px-4 py-2 mt-4 bg-green-500 text-white rounded-md text-base ml-4" onClick={() => { handleVerified(curentUser.id) }}> Valider le compte </button>
                                    <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setCurrentUser({}) }}> Fermer </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Dashbord>
        </>
    )
}

export default AdminDashboard