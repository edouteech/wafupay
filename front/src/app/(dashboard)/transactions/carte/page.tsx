"use client"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import visa from "@/public/assets/images/visa.png"
import mscard from "@/public/assets/images/mscard.png"
import Image from "next/image";
import InputLabel from "../../Components/InputLabel";
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
                    <div className="text-base max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-center space-x-4 mb-6 gap-4">
                            <div className="flex items-center">
                                <input type="radio" id="visa" className="w-6 h-6" name="card" />
                                <label htmlFor="visa" className="pl-2"><Image alt="logo visa" src={visa}></Image></label>
                            </div>
                            <div className="flex items-center">
                                <input type="radio" id="mscard" className="w-6 h-6" name="card" />
                                <label htmlFor="mscard" className="pl-2"><Image alt="logo mscard" src={mscard}></Image></label>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">De :</label>
                            <div className="flex gap-4 flex-col px-8">
                                <InputLabel type="text" id="num" label="Numéro de votre carte"></InputLabel>
                                <InputLabel type="month" id="lavel" label="Date d'expiration"></InputLabel>
                                <div className="relative">
                                    <InputLabel type={`${showCvv ? 'text' : 'password'}`} id="lavel" label="CVV" classes="pl-32"></InputLabel>
                                    <button onClick={() => { setShowCvv(!showCvv) }} className="z-10">
                                        {showCvv && (
                                            <EyeOff className="absolute top-4 right-5"></EyeOff>
                                        )}
                                        {!showCvv && (
                                            <Eye className="absolute top-4 right-5"></Eye>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Vers :</label>
                            <div className="flex items-center mb-3">
                                <img src="wave-logo.png" alt="Wave" className="w-10 h-10 mr-3" /> {/* Remplacez 'wave-logo.png' par le chemin correct */}
                                <input
                                    type="text"
                                    placeholder="Montant"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="bg-gray-100 border border-gray-300 p-2 rounded-r">FCFA</span>
                            </div>
                            <div className="flex items-center mb-3">
                                <div className="flex items-center border border-gray-300 rounded-l p-2 bg-gray-100">
                                    <img src="flag.png" alt="Flag" className="w-6 h-4 mr-2" /> {/* Remplacez 'flag.png' par le chemin correct */}
                                    <span>+96</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Numéro de téléphone"
                                    className="w-full px-3 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                            Effectuer
                        </button>
                    </div>

                </div>
            </Dashbord>


        </>
    )
}

export default Carte