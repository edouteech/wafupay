/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { Eye, EyeOff, PenLine, Plus, Trash } from "lucide-react";
import axios from "axios";
import { Country, WProvider } from "@/app/types/types";
import { useSession } from "next-auth/react";
import Image from "next/image";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [providers, setProviders] = useState<any[]>([])
    const [show, setShow] = useState(false)
    const { data: session } = useSession()
    const [countries, setCountries] = useState<Country[]>([])

    //################################## MOUNTED ################################//
    useEffect(() => {
        if (session) {
            let p: any[] = []
            let c: any[] = []
            axios.get(`${apiUrl}/wallet-providers`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((resp) => {
                console.log(resp.data);

                // setProviders(resp.data.data)
                p = resp.data.data.slice(0, resp.data.length)
                axios.get(`${apiUrl}/countries`).then((resp) => {
                    // setCountries(resp.data.data)
                    c = resp.data.data.slice(0, resp.data.length)
                    for (let i = 0; i < p.length; i++) {
                        const el = p[i];
                        el.country_id = getElementById(parseInt(el.country_id), c)
                    }
                    setProviders(p)
                })
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


    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="w-3/4 mx-auto xs:w-full xs:px-4">
                    <div className="flex justify-between items-center mt-8">
                        <h2 className="font-bold text-black">Gestion des fournisseurs</h2>
                        <button className="flex justify-between items-center gap-4 bg-primary text-white hover:scale-95 duration-300 rounded-xl p-3" onClick={() => { setShow(!show) }}><Plus></Plus><span className="xs:hidden">Ajouter un fournisseur</span></button>
                    </div>
                    <div className="table text-base w-full mt-8">
                        <div className="text-[#8280FF] font-semibold thead bg-white rounded-2xl overflow-hidden text-left grid grid-cols-6 p-3 pl-4 text-textGray pr-4">
                            <div className="th col-span-2">Nom</div>
                            <div className="th">ISO</div>
                            <div className="th">Frais payin</div>
                            <div className="th">Frais Payout</div>
                            <div className="th">Actions</div>
                        </div>
                        <span className="block mt-12"></span>
                        <div className="tbody bg-white p-3 rounded-2xl overflow-hidden w-full">
                            {providers.map((prov, i) => (
                                <div className=" grid grid-cols-6 items-center p-3 pl-4 text-textGray font-normal pr-4" key={i}>
                                    <div className="font-semibold col-span-2">{prov.name}</div>
                                    <div className="flex items-center gap-4 justify-center px-4 font-bold">
                                        {prov.country_id.code}
                                        <Image src={require(`@/public/assets/images/${prov.country_id.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                                    </div>
                                    <div className="">{prov.transaction_fees[0].payin_fee}</div>
                                    <div className="">{prov.transaction_fees[0].payout_fee}</div>
                                    <div className="flex gap-2"><PenLine className="w-4 h-4"></PenLine><Trash className="w-4 h-4"></Trash></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {show && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur flex items-center justify-center" role="button" onClick={() => { setShow(!show) }}>
                            <form action="" className="w-2/5 bg-white rounded-3xl p-8 shadow-lg z-[5]">
                                <legend className="p-4 bg-primary text-white rounded-2xl font-bold uppercase text-center">Ajouter un fournisseur</legend>
                                <div className="mt-8">
                                    <input type="text" className="" />
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard