"use client"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"

function EndVerification() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    //################################## VARIABLES ##############################//



    //################################## MOUNTED ################################//
    useEffect(() => {
        let tok = localStorage.getItem('token')
        setAuth({ headers: { Authorization: `Bearer ${tok}` } })
    }, [])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div>
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold">Vérification terminée avec succès</p>
                                <p className="text-gray-600 mt-2">Merci pour votre confiance</p>
                                <p className="text-gray-600">Vous recevrez un email de confirmation</p>
                            </div>
                            <div className="flex justify-center">
                                <Link className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-md text-base" href="/dashboard"> Fermer </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Dashbord>


        </>
    )
}

export default EndVerification