"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Chart from "../Components/Chart";
import { Decrase, Encrase, Graph, Time, UserGroup } from "@/app/(dashboard)/Components/icons";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [showCvv, setShowCvv] = useState(false)


    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//




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
                                    <span className="text-2xl font-semibold mb-5">40689</span>
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
                                    <span className="text-2xl font-semibold mb-5">$89000</span>
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
                                    <span className="text-2xl font-semibold mb-5">40689</span>
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
                                    <span className="text-2xl font-semibold mb-5">$89000</span>
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
                                    <span className="text-2xl font-semibold mb-5">2040</span>
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
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard