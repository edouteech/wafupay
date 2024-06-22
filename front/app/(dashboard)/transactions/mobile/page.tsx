"use client"
import { useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"

function Dashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [methods, setMethods] = useState([]);


    //################################## MOUNTED ################################//



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

export default Dashboard