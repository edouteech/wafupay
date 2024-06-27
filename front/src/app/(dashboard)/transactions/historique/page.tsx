"use client"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Transaction } from "@/app/types/types"
import { Redo, RefreshCcw } from "lucide-react"

function Historique() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [searchTerm, setSearchTerm] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [trans, setTrans] = useState<Transaction[]>([])
    //################################## VARIABLES ##############################//



    //################################## MOUNTED ################################//
    useEffect(() => {
        let tok = localStorage.getItem('token')
        setAuth({ headers: { Authorization: `Bearer ${tok}` } })
        axios.get(`${apiUrl}/token/verify`, { headers: { Authorization: `Bearer ${tok}` } }).then((resp) => {
            console.log(resp.data);
            setTrans(resp.data.data.transactions)
        })
    }, [])

    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const getState = (tran: Transaction) => {

        axios.get(`${apiUrl}/check-transaction-status/${tran.token}/payin`, auth).then((resp) => {
            tran.payin_status = resp.data.data.status
            tran.payout_status = resp.data.data.status
        })
        setTrans(trans)
    }


    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="p-16">
                    <h1 className="font-bold text-gray-700 mb-4">
                        Recherche et filtrage des transactions
                    </h1>
                    <div className="text-base bg-white p-8 rounded-2xl w-9/12">
                        <form className="flex gap-4 ">
                            <input type="text" placeholder="Entrer votre recherche" className="focus-visible:outline-none rounded p-2 focus:border-2 focus:border-primary border-gray-200 border-2" />
                            <button className="p-2 text-white bg-primary rounded">Rechercher</button>
                        </form>
                        <div className="mt-8">
                            <button onClick={() => { setSearchBy('nom') }} className={`${searchBy == 'nom' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>Nom</button>
                            <button onClick={() => { setSearchBy('type') }} className={`${searchBy == 'type' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>Type</button>
                            <button onClick={() => { setSearchBy('trans_id') }} className={`${searchBy == 'trans_id' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>Transaction ID</button>
                            <button onClick={() => { setSearchBy('RD') }} className={`${searchBy == 'RD' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>RD</button>
                            <button onClick={() => { setSearchBy('ND') }} className={`${searchBy == 'ND' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>ND</button>
                            <button onClick={() => { setSearchBy('RA') }} className={`${searchBy == 'RA' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>RA</button>
                            <button onClick={() => { setSearchBy('NA') }} className={`${searchBy == 'NA' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>NA</button>
                            <button onClick={() => { setSearchBy('montant') }} className={`${searchBy == 'montant' ? 'bg-primary text-white' : 'bg-gray-200'} hover:bg-primary duration-500 hover:text-white py-1 px-2 mx-1`}>MONTANT</button>
                        </div>
                    </div>
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
                                            <span className={`${tran.payin_status == 'pending' ? 'bg-yellow-500' : tran.payin_status == 'success' ? 'bg-green-500' : tran.payin_status == 'failed' ? 'bg-red-500' : ''} p-2 text-white rounded`}>{`${tran.payin_status == 'pending' ? 'en cours' : tran.payin_status == 'succes' ? 'effectué' : tran.payin_status == 'failed' ? 'rejeté' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${tran.payout_status == 'pending' ? 'bg-yellow-500' : tran.payout_status == 'success' ? 'bg-green-500' : tran.payout_status == 'failed' ? 'bg-red-500' : ''} p-2 text-white rounded`}>{`${tran.payout_status == 'pending' ? 'en cours' : tran.payout_status == 'succes' ? 'effectué' : tran.payout_status == 'failed' ? 'rejeté' : ''}`}</span>
                                        </td>
                                        <td>
                                            <div className="relative group">
                                                <button onClick={() => { getState(tran) }} className="flex items-center justify-center rounded-full shadow-md duration-300">
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
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default Historique