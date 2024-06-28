"use client"
import Dashbord from "../../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Country } from "@/app/types/types";
import Image from "next/image";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [countries, setCountries] = useState<Country[]>([])


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
                <div className="w-3/4 mx-auto">
                    <table className="text-base w-full">
                        <thead className="bg-white rounded-2xl overflow-hidden text-left">
                            <tr>

                                <th className="p-3 pl-4 text-textGray font-normal rounded-l-2xl">Nom</th>
                                <th className="p-3 pl-4 text-textGray font-normal">ISO</th>
                                <th className="p-3 pl-4 text-textGray font-normal">ID</th>
                                <th className="p-3 pl-4 text-textGray font-normal">NU</th>
                                <th className="p-3 pl-4 text-textGray font-normal rounded-r-2xl">NT</th>
                            </tr>
                        </thead>
                        <span className="block mt-12"></span>
                        <tbody className="block bg-white p-3 rounded-2xl overflow-hidden w-full">

                            {countries.map((country, i) => (
                                <tr className="">
                                    <td className="p-3 pl-4 font-semibold">{country.slug}</td>
                                    <td className="p-3 pl-4 td flex items-center gap-4">
                                        {country.code}
                                        <Image src={require(`../../../../public/assets/images/${country.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                                    </td>
                                    <td className="p-3 pl-4">{country.country_code}</td>
                                    <td className="p-3 pl-4"></td>
                                    <td className="p-3 pl-4"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard