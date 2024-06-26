"use client"
import Dashbord from "./Components/Dashbord"
import { useRouter } from "next/navigation"
import { use, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Carte() {
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
                <div>

                </div>
            </Dashbord>


        </>
    )
}

export default Carte