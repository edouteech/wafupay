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
const AdminSuppliers = () => {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const rootUrl = process.env.NEXT_PUBLIC_ROOTURL
    const router = useRouter()
    const { data: session } = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [suppliers, setSuppliers] = useState<any[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number[]>([])
    const [prev, setPrev] = useState('')
    const [next, setNext] = useState('')


    //################################## MOUNTED ################################//
    useEffect(() => {
        if (session) {
            let p: any[] = []
            let c: any[] = []
            axios.get(`${apiUrl}/admin/suppliers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
                setSuppliers(resp.data.data)
            })



        }
    }, [session])
    
  return (
    <>
        <Dashbord>
            <div>
                <div className="mx-32 my-12 xs:mx-2 w-auto xs:my-0">
                    <h2 className="text-center text-[#8280FF] font-semibold mb-8">Liste des Fournisseurs</h2>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                    {suppliers.map((supplier, i) => (
                        <div className="flex flex-col rounded-2xl bg-[#ffffff] shadow-xl" key={i}>
                            <div className="flex flex-col p-4">
                                <h4 className="text-2xl font-bold text-[#374151] pb-2">{supplier.name}</h4>
                                <table className="table-fixed w-full text-left">
                                    <thead className="uppercase text-gray-500 bg-gray-500 text-white">
                                        <tr>
                                            <td className="py-1 border text-center">Nom</td>
                                            <td className="py-1 border text-center">Payin</td>
                                            <td className="py-1 border text-center">Payout</td>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white text-gray-500 bg-[#FFFFFF] text-[#6b7280] bg-white text-gray-500 bg-[#FFFFFF] text-[#6b7280]">
                                        {Object.entries(JSON.parse(supplier.wallet_name)).map(([wallet, name]) => (
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
                                    <button className="bg-cyan-500 text-white p-2 rounded-lg hover:bg-cyan-600">Modifier</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    
                    {/* <table className="w-full min-w-full xs:w-auto">
                        <thead className="bg-white text-left text-base font-semibold">
                            <tr>
                                <th className="py-2">Nom</th>
                                <th className="py-2">Labels</th>
                                <th className="py-2">Payins</th>
                                <th className="py-2">Payouts</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-base text-black">
                            {suppliers.map((supplier, i) => (
                                <tr className="text-left text-sm" key={i}>
                                    <td className="p-1 pl-6">{supplier.name}</td>
                                    <td className="p-1 pl-4">{supplier.wallet_name}</td>
                                    <td className="p-1 ">Admin</td>
                                    <td className="flex gap-2 p-1">
                                        <Eye className="w-4 h-4"></Eye>
                                        <PenLine className="w-4 h-4"></PenLine>
                                        <Trash className="w-4 h-4"></Trash>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </Dashbord>
    </>
  )
}

export default AdminSuppliers