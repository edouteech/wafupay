/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, PenLine, RefreshCcw, Trash } from "lucide-react";
import { Transaction } from "@/app/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [trans, setTrans] = useState<Transaction[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number[]>([])
    const [prev, setPrev] = useState('')
    const [next, setNext] = useState('')
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const { data: session } = useSession()


    //################################## MOUNTED ################################//
    useEffect(() => {
        if (!session) {
            return
        }
        setAuth({ headers: { Authorization: `Bearer ${session?.user.token}` } })
        axios.get(`${apiUrl}/admin/transactions`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
            setTrans(resp.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(resp.data.data.total / resp.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            setPageCount(tab)
            setPrev(resp.data.data.prev_page_url)
            setNext(resp.data.data.next_page_url)
        })
    }, [session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const changePage = (page: number) => {
        axios.get(`${apiUrl}/admin/transactions?page=${page}`, auth).then((resp) => {
            setTrans(resp.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(resp.data.data.total / resp.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            setPage(page)
            setPageCount(tab)
            setPrev(resp.data.data.prev_page_url)
            setNext(resp.data.data.next_page_url)
        })
    }

    const prevOrNext = (link: string) => {
        if (link) {
            axios.get(`${link}`, auth).then((resp) => {
                setTrans(resp.data.data.data)
                let tab = []
                for (let i = 0; i < Math.ceil(resp.data.data.total / resp.data.data.per_page); i++) {
                    tab[i] = i + 1
                }
                setPage(resp.data.data.current_page)
                setPageCount(tab)
                setPrev(resp.data.data.prev_page_url)
                setNext(resp.data.data.next_page_url)
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
                <h2 className="text-center text-[#7068B0] font-semibold mb-8 mt-16 xs:px-4">Liste des transactions</h2>
                    <div className=" text-base w-full">
                        <table className="mx-auto rounded-3xl bg-white overflow-hidden text-center">
                            <thead className="text-secBlue border-b border-gray-300">
                                <th className="p-2 ">Date</th>
                                <th className="p-2 ">Tel Envoyeur</th>
                                <th className="p-2 ">Tel Receveur</th>
                                <th className="p-2 ">Montant</th>
                                <th className="p-2 ">Statut envoyeur</th>
                                <th className="p-2 ">Statut Receveur</th>
                                <th className="p-2 ">Action</th>
                            </thead>
                            <tbody>
                                {trans.map((tran, i) => (
                                    <tr key={i}>
                                        <td className="p-3">{formatDate(tran.created_at)}</td>
                                        <td className="p-3">{tran.payin_phone_number}</td>
                                        <td className="p-3">{tran.payout_phone_number}</td>
                                        <td className="p-3 text-primary">{tran.amount}</td>
                                        <td className="">
                                            <span className={`${tran.payin_status == 'pending' ? 'text-yellow-500' : tran.payin_status == 'success' ? 'text-green-500' : tran.payin_status == 'failed' ? 'text-red-500' : ''} p-2 text-white rounded`}>{`${tran.payin_status == 'pending' ? 'en cours' : tran.payin_status == 'succes' ? 'effectué' : tran.payin_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payout_status == 'pending' ? 'text-yellow-500' : tran.payout_status == 'success' ? 'text-green-500' : tran.payout_status == 'failed' ? 'text-red-500' : ''} p-2 text-white rounded`}>{`${tran.payout_status == 'pending' ? 'en cours' : tran.payout_status == 'succes' ? 'effectué' : tran.payout_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <div className="flex gap-2 p-3"><PenLine className="w-4 h-4"></PenLine><Trash className="w-4 h-4"></Trash></div>
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