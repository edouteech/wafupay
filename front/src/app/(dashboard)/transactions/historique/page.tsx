/* eslint-disable react/no-unescaped-entities */
"use client"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Transaction } from "@/app/types/types"
import { ChevronLeft, ChevronRight, Redo, RefreshCcw } from "lucide-react"
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

    //################################## VARIABLES ##############################//



    //################################## MOUNTED ################################//
    useEffect(() => {
        if (!session) {
            return
        }
        setAuth({ headers: { Authorization: `Bearer ${session?.user.token}` } })
        axios.get(`${apiUrl}/transactions`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((response) => {
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

    const changePage = (page:number) =>{
        axios.get(`${apiUrl}/transactions?page=${page}`, auth).then((response) => {
            setTrans(response.data.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(response.data.data.total / response.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            setPage(page)
            setPageCount(tab)
            setPrev(response.data.data.prev_page_url)
            setNext(response.data.data.next_page_url)
        })
    }

    const prevOrNext = (link : string) =>{
        if (link) {
            axios.get(`${link}`, auth).then((response) => {
                setTrans(response.data.data.data)
                let tab = []
                for (let i = 0; i < Math.ceil(response.data.data.total / response.data.data.per_page); i++) {
                    tab[i] = i + 1
                }
                setPage(response.data.data.current_page)
                setPageCount(tab)
                setPrev(response.data.data.prev_page_url)
                setNext(response.data.data.next_page_url)
            })
        }else{
            return;
        }
    }


    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="p-16 mb-8">
                    <h1 className="font-bold text-gray-700 mb-4">
                        Historique des transactions
                    </h1>
                    <div className=" mt-8 text-base w-full">
                        <table className="rounded-3xl bg-white overflow-hidden text-center w-full">
                            <thead className="text-secBlue border-b border-gray-300">
                                <th className="p-2 ">Date</th>
                                <th className="p-2 ">Envoyeur</th>
                                <th className="p-2 ">Receveur</th>
                                {/* <th className="p-2 ">Frais appliqué</th> */}
                                <th className="p-2 ">Montant</th>
                                <th className="p-2 ">Envoi</th>
                                <th className="p-2 ">Recept.</th>
                                <th className="p-2 ">Action</th>
                            </thead>
                            <tbody>
                                {trans.map((tran, i) => (
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
                                            <span className={`${tran.payin_status == 'pending' ? 'bg-yellow-500' : tran.payin_status == 'success' ? 'bg-green-500' : tran.payin_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded`}>{`${tran.payin_status == 'pending' ? 'en cours' : tran.payin_status == 'success' ? 'effectué' : tran.payin_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payout_status == 'pending' ? 'bg-yellow-500' : tran.payout_status == 'success' ? 'bg-green-500' : tran.payout_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded`}>{`${tran.payout_status == 'pending' ? 'en cours' : tran.payout_status == 'success' ? 'effectué' : tran.payout_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td>
                                            <div className="relative group">
                                                <button onClick={() => { getState(tran, i) }} className="flex items-center justify-center rounded-full shadow-md duration-300">
                                                    <RefreshCcw className="w-6 h-6" />
                                                </button>
                                                <div className="absolute top-full -left-1/2 mt-2 mb-2 transform opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white text-xs rounded py-1 px-2 transition-opacity duration-300">
                                                    Actualiser l'état
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex float-end mt-8 gap-3 items-center">
                            <button className="text-primary" onClick={()=>{prevOrNext(prev)}}>
                                <ChevronLeft></ChevronLeft>
                            </button>
                            <div className="flex gap-2">
                                {pageCount.map((btn,i)=>(
                                    <button className={`${page == btn ? 'text-white bg-primary' : ' text-primary'} h-8 w-8 rounded`} onClick={()=>{changePage(btn)}} key={i}>{btn}</button>
                                ))}
                            </div>
                            <button className="flex gap-1 text-primary" onClick={()=>{prevOrNext(next)}}>
                                Suivant <ChevronRight></ChevronRight>
                            </button>
                        </div>
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default Historique