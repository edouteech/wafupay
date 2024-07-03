"use client"
import Dashbord from "../Components/Dashbord"
import { useRouter } from "next/navigation"
import { use, useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

function Carte() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [showFaq, setShowFaq] = useState<boolean[]>([])


    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="m-8">
                    <h2 className="text-center bg-white p-2 rounded-2xl">FAQ</h2>
                    <div className="p-4 bg-white my-3 rounded-2xl shadow-xl">
                        <button className=" my-3font-bold text-black  rounded-2xl w-full flex justify-between items-center">
                            Comment puis-je envoyer de l'argent avec WAPUFAY ?
                            <div className="flex items-center justify-center h-8 w-8 bg-primary rounded-full">
                                <ChevronDown className="text-white"></ChevronDown>
                            </div> 
                        </button>
                        <p className="text-sm p-2">Pour envoyer de l'argent avec WAPUFAY, commencez par vous connecter à votre compte utilisateur. Ensuite, choisissez l'option d'envoi d'argent et saisissez les détails du destinataire, y compris son nom, son numéro de téléphone ou son adresse e-mail. Après avoir spécifié le montant que vous souhaitez envoyer, vous aurez l'opportunité de vérifier les informations de la transaction. Une fois que tout est correct, confirmez la transaction et vous recevrez une confirmation instantanée.</p>
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default Carte