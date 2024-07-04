/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Chart from "../Components/Chart";
import { Decrase, Encrase, Graph, Time, UserGroup } from "@/app/(dashboard)/Components/icons";
import axios from "axios";
import { headers } from "next/headers";
import { useSession } from "next-auth/react";
import { Transaction } from "@/app/types/types";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const { data: session } = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: `Bearer ` } })
    const [trans, setTrans] = useState<Transaction[]>([])
    const [totalTrans, setTotalTrans] = useState(0)
    const [totalMontant, setTotalMontant] = useState(0)
    const [marge, setMarge] = useState(0)
    const [partner, setPartner] = useState(0)
    const [daily, setDaily] = useState<any[]>([])
    const [monthly, setMonthly] = useState<any[]>([])
    const [weekly, setWeekly] = useState<any[]>([])


    //################################## MOUNTED ################################//
    useEffect(() => {
        setAuth({ headers: { Authorization: `Bearer ${session?.user.token}` } })
        axios.get(`${apiUrl}/admin/dashboard`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
            let data = resp.data
            setDaily(data.daily_transactions[0] ? data.daily_transactions : [0,0,0,0,0,0,0])
            setWeekly(data.weekly_transactions[0] ? data.weekly_transactions : [0,0,0,0,0,0,0])
            setMonthly(data.monthly_transactions[0] ? data.monthly_transactions : [0,0,0,0,0,0,0,0,0,0,0,0])
            setMarge(data.brut_margin)
            setTotalMontant(data.transactions_amount)
            setTotalTrans(data.transactions_count)
            setTrans(data.last_transactions)
            setPartner(data.partners_fees)
        })
    }, [session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }



    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="text-base m-4 ml-8">
                    <div className="flex gap-8 mb-8">
                        <div className="bg-white p-8 rounded-3xl basis-1/2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-4">Total des transactions</p>
                                    <span className="text-2xl font-semibold mb-5">{totalTrans}</span>
                                </div>
                                <div className="bg-[#8280FF55] rounded-xl p-4 flex items-center justify-center">
                                    <UserGroup></UserGroup>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <span className="flex items-center gap-3 text-[#00B69B]"><Encrase></Encrase> 8.5% </span>
                                <span>Up from yesterday</span>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl basis-1/2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-4">Chiffre d'affaire</p>
                                    <span className="text-2xl font-semibold mb-5">${totalMontant}</span>
                                </div>
                                <div className="bg-[#8280FF55] rounded-xl p-4 flex items-center justify-center">
                                    <UserGroup></UserGroup>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <span className="flex items-center gap-3 text-[#F93C65]"><Decrase></Decrase> 4.5% </span>
                                <span>Down from yesterday</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="bg-white p-8 rounded-3xl basis-1/3">
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-4">Nbre de transactions</p>
                                    <span className="text-2xl font-semibold mb-5">{totalTrans}</span>
                                </div>
                                <div className="bg-[#8280FF55] rounded-xl p-4 flex items-center justify-center">
                                    <UserGroup></UserGroup>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <span className="flex items-center gap-3 text-[#00B69B]"><Encrase></Encrase> 8.5% </span>
                                <span>Up from yesterday</span>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl basis-1/3">
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-4">Partenaire</p>
                                    <span className="text-2xl font-semibold mb-5">${partner}</span>
                                </div>
                                <div className="bg-[#00B69B55] rounded-xl p-4 flex items-center justify-center">
                                    <Graph></Graph>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <span className="flex items-center gap-3 text-[#F93C65]"><Decrase></Decrase> 4.5% </span>
                                <span>Down from yesterday</span>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl basis-1/3">
                            <div className="flex justify-between">
                                <div>
                                    <p className="mb-4">Marge brute</p>
                                    <span className="text-2xl font-semibold mb-5">{marge}</span>
                                </div>
                                <div className="bg-[#F93C6555] rounded-xl p-4 flex items-center justify-center">
                                    <Time></Time>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-8">
                                <span className="flex items-center gap-3 text-[#00B69B]"><Encrase></Encrase> 1.8% </span>
                                <span>Up from yesterday</span>
                            </div>
                        </div>
                    </div>

                    <div className=" mt-8 text-base w-full px-16">
                        <h2 className="text-center text-xl font-bold my-8 text-black">Transactions récentes</h2>
                        <table className="rounded-3xl bg-white overflow-hidden text-center w-full">
                            <thead className="text-secBlue border-b border-gray-300">
                                <th className="p-2 ">Date</th>
                                <th className="p-2 ">Tel Envoyeur</th>
                                <th className="p-2 ">Tel Receveur</th>
                                <th className="p-2 ">Frais appliqué</th>
                                <th className="p-2 ">Montant</th>
                            </thead>
                            <tbody>
                                {trans.map((tran, i) => (
                                    <tr key={i}>
                                        <td className="p-2">{formatDate(tran.created_at)}</td>
                                        <td className="p-2">{tran.payin_phone_number}</td>
                                        <td className="p-2">{tran.payout_phone_number}</td>
                                        <td className="p-2">{parseInt(tran.amount) - parseInt(tran.amountWithoutFees)}</td>
                                        <td className="p-2 text-primary">{tran.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className=" mt-8 text-base w-full px-16">
                        <h2 className="text-center text-xl font-bold my-8 text-black">Statistiques</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Chart types="Journalière" infos={daily}></Chart>
                                <h3 className="text-center font-semibold text-black my-3 text-xl">Journalière</h3>
                            </div>
                            <div>
                                <Chart types="Hebdomadaire" infos={monthly}></Chart>
                                <h3 className="text-center font-semibold text-black my-3 text-xl">Hebdomadaire</h3>
                            </div>
                        </div>
                            <div className="w-1/2 mx-auto mt-4">
                                <Chart types="Mensuelle" infos={monthly}></Chart>
                                <h3 className="text-center font-semibold text-black my-3 text-xl">Mensuelle</h3>
                            </div>
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard