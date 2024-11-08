/* eslint-disable react/no-unescaped-entities */
"use client"
import { Country, Supplier, WProvider } from "@/app/types/types";
import axios from "axios";
import { PenLine, Plus, Trash, Eye, Edit, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dashbord from "../Components/Dashboard";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [providers, setProviders] = useState<any[]>([])
    const [show, setShow] = useState(false)
    const { data: session } = useSession()
    const [countries, setCountries] = useState<Country[]>([])

    const [responses, setResponses] = useState([])
    const [responseData, setResponseData] = useState<any[]>([])
    const [suppliers , setSuppliers] = useState<Supplier[]>([])
    const [requestDone, setRequestDone] = useState(false)
    const [viewItem, setViewItem] = useState<WProvider | null>(null)

    //################################## MOUNTED ################################//
    useEffect(() => {
        if (session) {
            let p: any[] = []
            let c: any[] = []
            axios.get(`${apiUrl}/admin/wallet-providers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((response) => {
                let infos = response.data.data;

                setResponses(infos)
                setResponseData(infos.data)
                // setProviders(response.data.data)
                // p = response.data.data.slice(0, response.data.length)
                // axios.get(`${apiUrl}/countries`).then((response) => {
                //     // setCountries(response.data.data)
                //     c = response.data.data.slice(0, response.data.length)
                //     for (let i = 0; i < p.length; i++) {
                //         const el = p[i];
                //         el.country_id = getElementById(parseInt(el.country_id), c)
                //     }
                //     setProviders(p)
                // })
            })
            axios.get(`${apiUrl}/admin/suppliers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
                setSuppliers(resp.data.data)
            })



        }
    }, [session])
    useEffect(() => {

    }, [])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    function getElementById(id: number | string, elements: any[]) {
        return elements.find(element => element.id === id);
    }

    function handleChangeSupllier(supplier_id: string, provider_id: number, type: "payin" | "payout") {
        let data = {'supplier_id': supplier_id, 'provider_id': provider_id, 'type': type}
        axios.put(`${apiUrl}/admin/provider-supplier`, {...data}, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((rep) => {
            console.log(rep)
        })
    }


    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="w-3/4 mx-auto xs:w-full xs:px-4">
                    <div className="flex justify-between">
                        <h3 className="text-center text-primary text-3xl font-semibold mb-8">Liste des Opérateurs</h3>
                        <div>
                            {/* <button 
                                className="bg-primary text-white p-2 rounded-lg"
                                onClick={(e) => {e.preventDefault(); initData(); setShowForm(1);}}
                                >
                                Ajouter un Fournisseur
                            </button> */}
                        </div>
                    </div>
                    {responseData.length > 0 ? (
                    <div className="table text-base w-full mt-8">
                        <div className="text-[#8280FF] font-semibold thead bg-white rounded-2xl overflow-hidden text-left grid grid-cols-6 p-3 pl-4 text-textGray pr-4">
                            <div className="th col-span-2">Nom</div>
                            <div className="th">Frais payin</div>
                            <div className="th">Frais Payout</div>
                            <div className="th">Chiffre d'affaire</div>
                            <div className="th">Actions</div>
                        </div>
                        <span className="block mt-12"></span>
                        <div className="tbody bg-white p-3 rounded-2xl overflow-hidden w-full">
                            {responseData.map((item, i) => (
                                <div className=" grid grid-cols-6 items-center p-3 pl-4 text-textGray font-normal pr-4" key={i}>
                                    <div className="font-semibold col-span-2">{item.name}</div>
                                    <div className="">
                                        {item.payin_fee} % (
                                        {(item.suppliers.map((supplier: Supplier, i: number) => (
                                            <span key={i}>
                                            {(supplier.pivot?.type == "payin") ? (
                                            <> {supplier.name}</>
                                            ) : ('')}
                                            </span>
                                        )))}) 
                                    </div>
                                    <div className="">
                                        {item.payout_fee} % (
                                        {(item.suppliers.map((supplier: Supplier, i: number) => (
                                            <span key={i}>
                                            {(supplier.pivot?.type == "payout") ? (
                                            <> {supplier.name}</>
                                            ) : ('')}
                                            </span>
                                        )))}) 
                                    </div>
                                    <div className="">------</div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => { setViewItem(item) }}
                                            className="p-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        {/* <button 
                                            className="p-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                            >
                                            <Edit className="w-4 h-4" />
                                        </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : ("")}

                    
                    {viewItem ? (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                            <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-bold uppercase text-center text-primary mb-3">Informations de la transaction</h3>
                                    <X className="w-6 h-6 text-red-500 border border-red-500 border-rounded" onClick={() => { setViewItem(null) }} />
                                </div>
                                <div className="text-left">
                                    <table>
                                        <tr>
                                            <th className="p-2 ">Date</th>
                                            <th className="p-2 font-light"> {viewItem.created_at} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Nom</th>
                                            <th className="p-2 font-light"> {viewItem.name} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Pays</th>
                                            <th className="p-2 font-light"> ({viewItem.country.country_code}) {viewItem.country.slug} </th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Frais payin</th>
                                            <th className="p-2 font-light"> {viewItem.payin_fee} %</th>
                                        </tr>
                                        <tr>
                                            <th className="p-2 ">Frais payout</th>
                                            <th className="p-2 font-light"> {viewItem.payout_fee} %</th>
                                        </tr>
                                        {(viewItem.suppliers.map((supplier, i) => (
                                            <>
                                            {(supplier.pivot?.type == "payin") ? (
                                            <tr>
                                                <th className="p-2 ">Fournisseur de payin</th>
                                                <th className="p-2 font-light">
                                                     <select name="" id="" onChange={(e) => {handleChangeSupllier(e.target.value, viewItem.id, "payin")}}>
                                                        {suppliers.map((item, i) => (
                                                            <option value={item.id} key={i} selected={item.name == supplier.name}>{item.name}</option>
                                                        ))}
                                                     </select>
                                                </th>
                                            </tr>
                                            ) : (
                                            <tr>
                                                <th className="p-2 ">Fournisseur de payout</th>
                                                <th className="p-2 font-light">
                                                     <select name="" id="" onChange={(e) => {handleChangeSupllier(e.target.value, viewItem.id, "payout")}}>
                                                        {suppliers.map((item, i) => (
                                                            <option value={item.id} key={i} selected={item.name == supplier.name}>{item.name}</option>
                                                        ))}
                                                     </select>
                                                </th>
                                            </tr>
                                            )}
                                            </>
                                        )))}
                                    </table>
                                </div>    
                                    
                            </div>
                        </div>
                    ) : ('')}
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard