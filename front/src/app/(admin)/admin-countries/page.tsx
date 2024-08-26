/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import axios from "axios";
import { Country } from "@/app/types/types";
import Image from "next/image";
import InputWithLabel from "@/app/(dashboard)/Components/InputLabel";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [countries, setCountries] = useState<Country[]>([])
    const [show, setShow] = useState(false)


    //################################## MOUNTED ################################//
    useEffect(() => {
        axios.get(`${apiUrl}/countries`).then((resp) => {
            setCountries(resp.data.data)
        })
    }, [])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="w-3/4 mx-auto xs:w-full px-4">
                    <div className="flex justify-between items-center mt-8">
                        <h2 className="font-bold text-black">Gestion des pays</h2>
                        <button className="flex justify-between items-center gap-4 bg-primary text-white hover:scale-95 duration-300 rounded-xl p-3" onClick={()=>{setShow(!show)}}><Plus></Plus><span className="xs:hidden">Ajouter un pays</span></button>
                    </div>
                    <div className="table text-base w-full mt-8">
                        <div className="thead bg-white rounded-2xl overflow-hidden text-left grid grid-cols-5 p-3 pl-4 text-textGray font-normal pr-4">
                            <div className="th">Nom</div>
                            <div className="th">ISO</div>
                            <div className="th">ID</div>
                            <div className="th">NU</div>
                            <div className="th">NT</div>
                        </div>
                        <span className="block mt-8"></span>
                        <div className="tbody bg-white p-3 rounded-2xl overflow-hidden w-full">
                            {countries.map((country, i) => (
                                <div className=" grid grid-cols-5 items-center p-3 pl-4 text-textGray font-normal pr-4" key={i}>
                                    <div className="font-semibold">{country.slug}</div>
                                    <div className="flex items-center gap-4 justify-center px-4">
                                        {country.code}
                                        <Image src={require(`@/public/assets/images/${country.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                                    </div>
                                    <div className="">{country.country_code}</div>
                                    <div className="">100</div>
                                    <div className="">100</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {show && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur flex items-center justify-center" role="button" onClick={()=>{setShow(!show)}}>
                            <form action="" className="w-2/5 bg-white rounded-3xl p-8 shadow-lg z-[5]">
                                <legend className="p-4 bg-primary text-white rounded-2xl font-bold uppercase text-center">Ajouter un pays</legend>
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