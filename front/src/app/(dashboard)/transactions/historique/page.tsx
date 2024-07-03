"use client"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Transaction } from "@/app/types/types"
import { ChevronLeft, ChevronRight, Redo, RefreshCcw } from "lucide-react"
import Link from "next/link"

function Historique() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
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
        let tok = localStorage.getItem('token')
        setAuth({ headers: { Authorization: `Bearer ${tok}` } })
        axios.get(`${apiUrl}/transactions`, { headers: { Authorization: `Bearer ${tok}` } }).then((resp) => {
            setTrans(resp.data.data.data)
            let tab = []
            for (let i = 0; i < Math.ceil(resp.data.data.total / resp.data.data.per_page); i++) {
                tab[i] = i + 1
            }
            setPageCount(tab)
            setPrev(resp.data.data.prev_page_url)
            setNext(resp.data.data.next_page_url)
        })
    }, [])

    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const getState = (tran: Transaction, i: number) => {

        axios.get(`${apiUrl}/check-status/${tran.token}/payin`, auth).then((resp) => {
            let tab = trans.slice()
            tab[i].payin_status = resp.data.data.status
            tab[i].payout_status = resp.data.data.status
            setTrans(tab)
        })
        setTrans(trans)
    }

    const changePage = (page:number) =>{
        axios.get(`${apiUrl}/transactions?page=${page}`, auth).then((resp) => {
            setTrans(resp.data.data.data)
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

    const prevOrNext = (link : string) =>{
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
        }else{
            return;
        }
    }

    // const getData = () =>{
        
    // }

    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="p-16 mb-8">
                    <h1 className="font-bold text-gray-700 mb-4">
                        Recherche et filtrage des transactions
                    </h1>
                    <div className=" mt-8 text-base w-full">
                        <table className="rounded-3xl bg-white overflow-hidden text-center">
                            <thead className="text-secBlue border-b border-gray-300">
                                <th className="p-2 ">Date</th>
                                <th className="p-2 ">Tel Envoyeur</th>
                                <th className="p-2 ">Tel Receveur</th>
                                <th className="p-2 ">Frais appliqué</th>
                                <th className="p-2 ">Montant</th>
                                <th className="p-2 ">Statut envoyeur</th>
                                <th className="p-2 ">Statut Receveur</th>
                                <th className="p-2 ">Action</th>
                            </thead>
                            <tbody>
                                {trans.map((tran, i) => (
                                    <tr key={i}>
                                        <td className="p-2">{formatDate(tran.created_at)}</td>
                                        <td className="p-2">{tran.payin_phone_number}</td>
                                        <td className="p-2">{tran.payout_phone_number}</td>
                                        <td className="p-2">{parseInt(tran.amount) - parseInt(tran.amountWithoutFees)}</td>
                                        <td className="p-2 text-primary">{tran.amount}</td>
                                        <td className="">
                                            <span className={`${tran.payin_status == 'pending' ? 'bg-yellow-500' : tran.payin_status == 'success' ? 'bg-green-500' : tran.payin_status == 'failed' ? 'bg-red-500' : ''} p-2 text-white rounded`}>{`${tran.payin_status == 'pending' ? 'en cours' : tran.payin_status == 'succes' ? 'effectué' : tran.payin_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payout_status == 'pending' ? 'bg-yellow-500' : tran.payout_status == 'success' ? 'bg-green-500' : tran.payout_status == 'failed' ? 'bg-red-500' : ''} p-2 text-white rounded`}>{`${tran.payout_status == 'pending' ? 'en cours' : tran.payout_status == 'succes' ? 'effectué' : tran.payout_status == 'failed' ? 'échoué' : ''}`}</span>
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