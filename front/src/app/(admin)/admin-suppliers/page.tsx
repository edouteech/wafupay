/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Eye, EyeOff, PenLine, Trash, X } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";
import Image from "next/image";
const AdminSuppliers = () => {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const rootUrl = process.env.NEXT_PUBLIC_ROOTURL
    const router = useRouter()
    const { data: session } = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const [showForm, setShowForm] = useState<number>(0);
    const [editIndex, setEditIndex] = useState<number|null>(null);
    const [name, setName] = useState<any>("");
    const [walletName, setWalletName] = useState<any>({});
    const [payinFees, setPayinFees] = useState<any>({});
    const [payoutFees, setPayoutFees] = useState<any>({});
    const [activeTab, setActiveTab] = useState<number>(1);


    //################################## MOUNTED ################################//
    useEffect(() => {
        if (session) {
            let p: any[] = []
            let c: any[] = []
            axios.get(`${apiUrl}/admin/suppliers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
                setSuppliers(resp.data.data)
            })


            axios.get(`${apiUrl}/wallet-providers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
                setProviders(resp.data.data)
            })
        }
    }, [session])

    const initData = () => {
        setName('')
        setWalletName({})
        setPayinFees({})
        setPayoutFees({})
    }

    const editData = (index: number) => {
        setEditIndex(index)
        setName(suppliers[index].name)
        setWalletName(JSON.parse(suppliers[index].wallet_name))
        setPayinFees(JSON.parse(suppliers[index].payin_fees))
        setPayoutFees(JSON.parse(suppliers[index].payout_fees))
        // setName('')
        // setWalletName({})
        // setPayinFees({})
        // setPayoutFees({})
    }

    const handleChange = (e: any, field: string, provider_name: string) => {
        if (field == "name") {
            setName(e.target.value)
        }else if(field == "wallet_name") {
            setWalletName({ ...walletName, [provider_name]: e.target.value })
        }else if(field == "payin_fees") {
            setPayinFees({ ...payinFees, [provider_name]: e.target.value })
        }else if(field == "payout_fees") {
            setPayoutFees({ ...payoutFees, [provider_name]: e.target.value })
        }
    }

    const handleSubmit = async () => {
        const data = {'name': name, 'wallet_name': walletName, 'payin_fees': payinFees, 'payout_fees': payoutFees}
        if (editIndex == null) {
            await axios.post(`${apiUrl}/admin/suppliers`, data, { headers: { Authorization: `Bearer ${session?.user.token}` } })
        }else if(editIndex != null) {
            await axios.put(`${apiUrl}/admin/suppliers/${suppliers[editIndex].id}`, data, { headers: { Authorization: `Bearer ${session?.user.token}` } })
        }
        setShowForm(0)
        setEditIndex(null)
        initData()
    }
    
  return (
    <>
        <Dashbord>
            <div>
                <div className="mx-32 my-12 xs:mx-2 w-auto xs:my-0">
                    <div className="flex justify-between">
                        <h3 className="text-center text-primary text-3xl font-semibold mb-8">Liste des Fournisseurs</h3>
                        <div>
                            <button 
                                className="bg-primary text-white p-2 rounded-lg"
                                onClick={(e) => {e.preventDefault(); initData(); setShowForm(1);}}
                                >
                                Ajouter un Fournisseur
                            </button>
                        </div>
                    </div>
                    {/* <h3 className="text-center text-[#8280FF] font-semibold mb-8">{page === 1 ? 'Liste des Fournisseurs' : 'Page ' + page + ' de ' + pageCount}</h3> */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
            
                    {suppliers.map((supplier, i) => (
                        <div className="flex flex-col rounded-2xl bg-[#ffffff] shadow-xl" key={i}>
                            <div className="flex flex-col p-4">
                                <h4 className="text-2xl font-bold text-[#374151] pb-2 capitalize">{supplier.name}</h4>
                                <table className="table-fixed w-full text-left">
                                    <thead className="uppercase text-gray-500 bg-gray-500 text-white">
                                        <tr>
                                            <td className="py-1 border text-center">Nom</td>
                                            <td className="py-1 border text-center">Payin</td>
                                            <td className="py-1 border text-center">Payout</td>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white text-gray-500 bg-[#FFFFFF] text-[#6b7280] bg-white text-gray-500 bg-[#FFFFFF] text-[#6b7280]">
                                        {/* {Object.entries(JSON.parse(supplier.wallet_name)).map(([wallet, name]) => ( */}
                                        {Object.entries(JSON.parse(supplier.wallet_name) as Record<string, string>).map(([wallet, name]) => (
                                            <tr key={wallet} className="py-5">
                                                <td className="py-1 border text-center">{name}</td>
                                                <td className="py-1 border text-center">
                                                    {JSON.parse(supplier.payin_fees)[wallet] || 'N/A'}
                                                </td>
                                                <td className="py-1 border text-center">
                                                    {JSON.parse(supplier.payout_fees)[wallet] || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end pt-6">
                                    <button className="bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600" onClick={() => {editData(i); setShowForm(2);}}>Modifier</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>

                    {(showForm != 0) ? (
                        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                            <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-bold uppercase text-center text-primary mb-3">Formulaire de fournisseur</h3>
                                    <X className="w-6 h-6 text-red-500 border border-red-500 border-rounded" onClick={() => { setShowForm(0) }} />
                                </div>
                                <div className="">
                                    <div className="">
                                        <div className="">
                                            <label className="text-md" htmlFor="">Nom</label>
                                            <input type="text" className="border border-gray-300 rounded-md w-20 h-8 pl-2" onChange={(e) => handleChange(e, 'name', '')} value={name} />
                                            {walletName["MTN BENIN"]}
                                        </div>
                                        <div className="flex justify-start">
                                            <button className={'border border-sky-300' + (activeTab == 1 ? ' bg-sky-300' : '')} onClick={(e) => { e.preventDefault; setActiveTab(1); }}>Noms operateurs</button>
                                            <button className={'border border-sky-300' + (activeTab == 2 ? ' bg-sky-300' : '')} onClick={(e) => { e.preventDefault; setActiveTab(2); }}>Frais envoi</button>
                                            <button className={'border border-sky-300' + (activeTab == 3 ? ' bg-sky-300' : '')} onClick={(e) => { e.preventDefault; setActiveTab(3); }}>Frais reception</button>
                                        </div>
                                    </div>
                                        {(providers.length > 0 && activeTab == 1) ? (
                                            <div className="grid grid-cols-2 gap-2">
                                            {providers.map((provider, i) => (
                                                <div className="mb-2 flex justify-between" key={i}>
                                                    <label className="text-md" htmlFor="">{provider.name}</label>
                                                    <input type="text" className="border border-gray-300 rounded-md w-20 h-8 pl-2" onChange={(e) => handleChange(e,'wallet_name', provider.name)} value={walletName[provider.name] || ''} />
                                                </div>
                                            ))}
                                        </div>
                                        ) : ('')}
                                        {(activeTab == 2) ? (
                                            (providers.length > 0) ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {providers.map((provider, i) => (
                                                    <div className="mb-2 flex justify-between" key={i}>
                                                        <label className="text-md" htmlFor="">{provider.name}</label>
                                                        <input type="number" className="border border-gray-300 rounded-md w-20 h-8 pl-2" onChange={(e) => handleChange(e,'payin_fees', provider.name)} value={payinFees[provider.name] || ''}  />
                                                    </div>
                                                ))}
                                            </div>
                                            ) : ('')
                                        ) : ('')}
                                        {(activeTab == 3) ? (
                                            (providers.length > 0) ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {providers.map((provider, i) => (
                                                    <div className="mb-2 flex justify-between" key={i}>
                                                        <label className="text-md" htmlFor="">{provider.name}</label>
                                                        <input type="number" className="border border-gray-300 rounded-md w-20 h-8 pl-2" onChange={(e) => handleChange(e,'payout_fees', provider.name)} value={payoutFees[provider.name] || ''}  />
                                                    </div>
                                                ))}
                                            </div>
                                            ) : ('')
                                        ) : ('')}
                                </div>
                                <div className="">
                                    <button 
                                        className="bg-primary text-white p-2 rounded-lg"
                                        onClick={(e) => {e.preventDefault(); handleSubmit();}}
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : ('')}
                </div>
            </div>
        </Dashbord>
    </>
  )
}

export default AdminSuppliers