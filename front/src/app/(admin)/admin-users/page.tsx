"use client"
import Dashbord from "../Components/Dashboard"
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { headers } from "next/headers";

function AdminDashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const {data: session} = useSession()
    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({headers : {Authorization : ''}})


    //################################## MOUNTED ################################//
    useEffect(()=>{
        if (session && !auth.headers.Authorization) {
            setAuth({headers : {Authorization : `Bearer ${session.user?.token}`}})
            axios.get(`${apiUrl}/users`, {headers : {Authorization : `Bearer ${session.user?.token}`}}).then((resp)=>{resp.data})
        }
    },[session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div>

                </div>
            </Dashbord>


        </>
    )
}

export default AdminDashboard