/* eslint-disable react/no-unescaped-entities */
"use client"
import { Transaction } from "@/app/types/types"
import axios from "axios"
import { Edit, Eye, Trash, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { count } from "console"

function Historique() {
    //############################### CONSTANTES / STATES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const {data : session} = useSession()
    const [searchTerm, setSearchTerm] = useState('')
    const [searchBy, setSearchBy] = useState('')
    const [trans, setTrans] = useState<Transaction[]>([])
    const [response, setResponse] = useState<Transaction[]>([])
    const [requestDone, setRequestDone] = useState(false)
    const [viewTransaction, setViewTransaction] = useState({})
    const [providers, setProviders] = useState<any[]>([])
    const [resendData, setResendData] = useState<any>({provider_name: '', country_code: '', phone_number: ''})

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
        })

        axios.get(`${apiUrl}/admin/wallet-providers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((rep) => {
            setProviders(rep.data.data.data)
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
        })
    }

    const formatLabel = (label: string) => {
        label = label.replace("&laquo;", "<")
        label = label.replace("&raquo;", ">")
        return label;
    }

    const handdlePayout = (ref: string, phone_number: string, provider_name: string) => {
        axios.get(`${apiUrl}/init-payout/${viewTransaction[ref]}/${phone_number}/${provider_name}`, auth).then((rep) => {
            console.log(rep)
        })
        // setTrans(trans)
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
                                {response.data.map((transaction, i) => (
                                    <tr key={i}>
                                        <td className="p-2">{formatDate(transaction.created_at)}</td>
                                        <td className="p-2">
                                            {/* <span className="block text-xs">{transaction.payin_wprovider?.name}</span> */}
                                            <strong className="block text-sm font-bold">{transaction.payin_phone_number}</strong>
                                        </td>
                                        <td className="p-2">
                                            {/* <span className="block text-xs">{transaction.payout_wprovider?.name}</span> */}
                                            <strong className="block text-sm font-bold">{transaction.payout_phone_number}</strong>
                                        </td>
                                        {/* <td className="p-2">{parseInt(transaction.amount) - parseInt(transaction.amountWithoutFees)}</td> */}
                                        <td className="p-2 ">
                                            <strong className="text-primary font-bold">{transaction.amount} F</strong>
                                            <span className="font-light text-xs text-red-500"> / ({parseInt(transaction.amount) - parseInt(transaction.amountWithoutFees)} F)</span>
                                        </td>
                                        <td className="">
                                            <span className={`${transaction.payin_status == 'pending' ? 'bg-yellow-500' : transaction.payin_status == 'success' ? 'bg-green-500' : transaction.payin_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded-full`}>{`${transaction.payin_status == 'pending' ? 'en cours' : transaction.payin_status == 'success' ? 'effectué' : transaction.payin_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td className="">
                                            <span className={`${transaction.payout_status == 'pending' ? 'bg-yellow-500' : transaction.payout_status == 'success' ? 'bg-green-500' : transaction.payout_status == 'failed' ? 'bg-red-500' : ''} px-2 py-0 text-white rounded-full`}>{`${transaction.payout_status == 'pending' ? 'en cours' : transaction.payout_status == 'success' ? 'effectué' : transaction.payout_status == 'failed' ? 'échoué' : ''}`}</span>
                                        </td>
                                        <td>
                                            <div className="relative group flex gap-2">
                                                {/* <button onClick={() => { getState(transaction, i) }} className="flex items-center justify-center rounded-full shadow-md duration-300">
                                                    <RefreshCcw className="w-6 h-6" />
                                                </button>
                                                <div className="absolute top-full -left-1/2 mt-2 mb-2 transactionsform opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 text-white text-xs rounded py-1 px-2 transactionsition-opacity duration-300">
                                                    Actualiser l'état
                                                </div> */}
                                                <button 
                                                    onClick={() => { setViewTransaction(transaction) }}
                                                    className="p-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                    >
                                                    <Eye className="w-4 h-4" />
                                                </button>
{/* 
                                                <button 
                                                    className="p-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                                    >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button 
                                                    className="p-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    >
                                                    <Trash className="w-4 h-4" />
                                                </button> */}
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


                    {(viewTransaction.id != undefined) ? (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                            <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-bold uppercase text-center text-primary mb-3">Informations de la transaction</h3>
                                    <X className="w-6 h-6 text-red-500 border border-red-500 border-rounded" onClick={() => { setViewTransaction({}) }} />
                                </div>
                                <div className="text-left">
                                    <table>
                                        <tr>
                                            <th className="p-2 ">Date</th>
                                            <th className="p-2 font-light"> {viewTransaction.created_at} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Num envoyeur</th>
                                            <th className="p-2 font-light"> {viewTransaction.payin_phone_number} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Moyen d'envoi</th>
                                            <th className="p-2 font-light"> {viewTransaction.payin_wprovider?.name} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Num receveur</th>
                                            <th className="p-2 font-light"> {viewTransaction.payout_phone_number} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Moyen de réception</th>
                                            <th className="p-2 font-light"> {viewTransaction.payout_wprovider?.name} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Montant</th>
                                            <th className="p-2 font-light"> {viewTransaction.amount} FCFA </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Statut d'envoi</th>
                                            <th className="p-2 font-light"> {viewTransaction.payin_status} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Statut de réception</th>
                                            <th className="p-2 font-light"> {viewTransaction.payout_status} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Reference de la transaction</th>
                                            <th className="p-2 font-light"> {viewTransaction.payin_reference} </th>
                                        </tr>
                                    </table>
                                </div>    
                                    {(viewTransaction.payin_status == 'success' && viewTransaction.payout_status != 'success') ? (
                                    <>
                                    <div className="flex justify-between mt-4 border border-gray-300 p-2 rounded-lg">
                                        <div className="">
                                        
                                            <label className="text-md" htmlFor="">Operateur de reception</label>
                                            <select name="" id="" className="w-30" onChange={(e) => { setResendData({ ...resendData, provider_name: providers[e.target.value].name, country_code: providers[e.target.value].country.country_code }) }}>
                                                <option>-- Selectioner --</option>
                                                {providers.map((item, i) => (
                                                    <option value={i} key={i} >{item.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="">
                                            <label className="text-md" htmlFor="">Numéro de téléphone</label>
                                            <input type="text" className="border border-gray-300 rounded-md w-20 h-8 pl-2" onChange={(e) => { setResendData({ ...resendData, phone_number: e.target.value }) }} value={resendData.phone_number} />
                                        </div>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); handdlePayout("payin_reference", resendData.country_code+resendData.phone_number, resendData.provider_name) }}
                                        >Envoyer</button>
                                    </div>
                                    <div className="flex justify-between">
                                        <button className="px-4 py-2 mt-4 bg-green-500 text-white rounded-md text-base ml-4" onClick={() => { setViewTransaction({}) }}> Modifier et renvoyer </button>
                                        <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { handdlePayout("payin_reference", viewTransaction.payin_phone_number, viewTransaction.payin_wprovider?.name) }}> Retourner les fonds </button>
                                    </div>
                                    </>
                                    ) : ('')}
                            </div>
                        </div>
                    ) : ('')}
                </div>
            </Dashbord>


        </>
    )
}

export default Historique