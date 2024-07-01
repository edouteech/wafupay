"use client"
import Dashbord from "../Components/Dashbord"
import { useRouter } from "next/navigation"
import Image from "next/image"
import dashm from '@/public/assets/images/dashm.png'
import dashmSt from '@/public/assets/images/dashmSt.png'
import dashc from '@/public/assets/images/dashc.png'
import dashcSt from '@/public/assets/images/dashcSt.png'
import dashList from '@/public/assets/images/dashListe.png'
import { useSession } from "next-auth/react"
import { headers } from "next/headers"
import { url } from "inspector"
import { useEffect } from "react"
import axios from "axios"
import Select from "../Components/Select"

function Dashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const {data : session} = useSession()
    const auth = {headers : {Authorization : `Bearer ${session?.user.token}`}}
    //################################## VARIABLES ##############################//



    //################################## MOUNTED ################################//
    // useEffect(()=>{
    //     if (session?.user) {
    //         axios.post(`${apiUrl}/user/update-profile`, {"email" : "lodira6108@cutxsew.com", "first_name" : session?.user.firstname, "last_name" : session?.user.lastname, "phone_number" : session?.user.phone_num, "country_id" : 1}, auth)
    //     }
    // },[session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//



    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div>
                    <div className="flex items-center w-3/6 mb-4 ml-16">
                        <Image alt="momo" src={dashm}  className="w-48"></Image>
                        <Image alt="momo" src={dashmSt}></Image>
                    </div>
                    <div className="flex items-center w-3/6 ml-16">
                        <Image alt="carte" src={dashc} className="w-48"></Image>
                        <Image alt="carte" src={dashcSt}></Image>
                    </div>
                    <div className="m-16">
                        <Image src={dashList} alt="liste"></Image>
                    </div>

                    
                </div>
            </Dashbord>
        </>
    )
}

export default Dashboard