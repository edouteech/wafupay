/* eslint-disable react/no-unescaped-entities */
"use client"
import { Suspense, useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Transaction } from "@/app/types/types"
import { ChevronLeft, ChevronRight, Redo, RefreshCcw, Eye, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

function Historique() {
    //############################### CONSTANTES / STATES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const {data : session} = useSession()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [trans, setTrans] = useState<Transaction[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number[]>([])
    const [prev, setPrev] = useState('')
    const [next, setNext] = useState('')
    const [response, setResponse] = useState<Transaction[]>([])
    const [requestDone, setRequestDone] = useState(false)

    //################################## VARIABLES ##############################//



    //################################## MOUNTED ################################//
    useEffect(() => {
        if (!session) {
            return
        }
        setAuth({ headers: { Authorization: `Bearer ${session?.user.token}` } })
        axios.get(`${apiUrl}/transactions`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((response) => {
            setRequestDone(true)
            setResponse(response.data.data)
            setTrans(response.data.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(response.data.data.total / response.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            setPageCount(tab)
            setPrev(response.data.data.prev_page_url)
            setNext(response.data.data.next_page_url)
        })
    }, [session])

    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {year: 'numeric', month: 'long', day: 'numeric' });
    }

    const getState = (tran: Transaction, i: number) => {

        axios.get(`${apiUrl}/check-status/${tran.token}/payin`, auth).then((response) => {
            let tab = trans.slice()
            tab[i].payin_status = response.data.data.status
            tab[i].payout_status = response.data.data.status
            setTrans(tab)
        })
        setTrans(trans)
    }

    const changePage = (link:string) =>{
        axios.get(link, auth).then((response) => {
            setResponse(response.data.data)
            setTrans(response.data.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(response.data.data.total / response.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            // setPage(page)
            // setPageCount(tab)
            // setPrev(response.data.data.prev_page_url)
            // setNext(response.data.data.next_page_url)
        })
    }

    const formatLabel = (label: string) => {
        label = label.replace("&laquo;", "<")
        label = label.replace("&raquo;", ">")
        return label;
    }


    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="p-16 mb-8">
                    <h1 className="font-bold text-gray-700 mb-4">
                        Historique des transactions
                    </h1>
                    {requestDone ? (
                    <div className=" mt-8 text-base w-full">
                        {Array.isArray(response.data) && response.data.length > 0 ? (
                        <table className="rounded-3xl bg-white overflow-hidden text-center w-full">
                            <thead className="text-secBlue border-b border-gray-300">
                                <tr>
                                    <th className="p-2 ">Date</th>
                                    <th className="p-2 ">Envoyeur</th>
                                    <th className="p-2 ">Receveur</th>
                                    {/* <th className="p-2 ">Frais appliqué</th> */}
                                    <th className="p-2 ">Montant</th>
                                    <th className="p-2 ">Envoi</th>
                                    <th className="p-2 ">Recept.</th>
                                    <th className="p-2 ">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response.data.map((tran, i) => (
                                    <tr key={i}>
                                        <td className="p-2">{formatDate(tran.created_at)}</td>
                                        <td className="p-2">
                                            {/* <span className="block text-xs">{tran.payin_wprovider?.name}</span> */}
                                            <strong className="block text-sm font-bold">{tran.payin_phone_number}</strong>
                                        </td>
                                        <td className="p-2">
                                            {/* <span className="block text-xs">{tran.payout_wprovider?.name}</span> */}
                                            <strong className="block text-sm font-bold">{tran.payout_phone_number}</strong>
                                        </td>
                                        {/* <td className="p-2">{parseInt(tran.amount) - parseInt(tran.amountWithoutFees)}</td> */}
                                        <td className="p-2 ">
                                            <strong className="text-primary font-bold">{tran.amount} F</strong>
                                            <span className="font-light text-xs text-red-500"> / ({parseInt(tran.amount) - parseInt(tran.amountWithoutFees)} F)</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payin_status == 'pending' ? 'bg-yellow-500' : tran.payin_status == 'success' ? 'bg-green-500' : tran.payin_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded-full`}>{`${tran.payin_status == 'pending' ? 'en cours' : tran.payin_status == 'success' ? 'effectué' : tran.payin_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payout_status == 'pending' ? 'bg-yellow-500' : tran.payout_status == 'success' ? 'bg-green-500' : tran.payout_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded-full`}>{`${tran.payout_status == 'pending' ? 'en cours' : tran.payout_status == 'success' ? 'effectué' : tran.payout_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td>
                                            <div className="relative group flex gap-2">
                                                {/* <button onClick={() => { getState(tran, i) }} className="flex items-center justify-center rounded-full shadow-md duration-300">
                                                    <RefreshCcw className="w-6 h-6" />
                                                </button>
                                                <div className="absolute top-full -left-1/2 mt-2 mb-2 transform opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white text-xs rounded py-1 px-2 transition-opacity duration-300">
                                                    Actualiser l'état
                                                </div> */}
                                                <button 
                                                    onClick={() => { getState(tran, i) }}
                                                    className="p-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                    >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button 
                                                    className="p-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                                    >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button 
                                                    className="p-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        ) : (
                            "Aucune transaction"
                        )}
                        
                        <div className="flex float-end mt-8 gap-3 items-center">
                            {Array.isArray(response.links)&& response.data.length && response.links.length > 0 ? (
                                <ul className="flex gap-2">
                                {response.links.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url} 
                                            onClick={(e) => {e.preventDefault(); changePage(link.url)}}
                                            className={
                                                "px-3 py-1 rounded-md hover:bg-primary-600 border border-primary"
                                                + (link.label ? '' : 'cursor-not-allowed') 
                                                + (link.active ? ' text-primary' : ((link.url == null) ? ' text-primary' : ' text-white bg-primary'))
                                            }
                                            target="_blank" rel="noopener noreferrer">
                                            {formatLabel(link.label)}
                                        </a>
                                    </li>
                                ))}
                                </ul>
                            ) : ('')}
                        </div>
                    </div>
                     ) : (
                        <div>Loading...</div> // Show loading while request is not done
                    )}
                </div>
            </Dashbord>


        </>
    )
}

export default Historique