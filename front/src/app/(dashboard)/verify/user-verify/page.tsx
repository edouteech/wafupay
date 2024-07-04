/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../../Components/Dashbord"
import Image from "next/image"
import verify from "@/public/assets/images/verify.png"
import { useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import { strict } from "assert"
import Link from "next/link"
import axios from "axios"
import React from "react"

const UserVerifying: React.FC = () => {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    //################################## VARIABLES ##############################//

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [user, setUser] = useState<{ "first_name": string, "last_name": string, "email": string, "phone_num": number | string, "password": string, "password2": string }>({ "first_name": "", "last_name": "", "email": "", "phone_num": "", "password": "", "password2": "" })



    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//





    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="flex flex-col m-8 w-2/3 mx-auto gap-8 items-center text-center relative">
                    <h2 className="font-bold text-primary text-2xl">Vérification d'identité</h2>
                    <p className="text-black font-bold">Utiliser un document valide émis par le gouvernement</p>
                    <p>Seuls les documents suivants listés ci-dessous seront acceptés, tout autre document sera rejeté</p>

                    <div className="flex gap-4 absolute bottom-[-100px] left-0 right-0">
                        <Link className="basis-full p-4 bg-gray-200 hover:bg-primary hover:text-white text-black text-left duration-500" href={'user-verify/permis-de-conduire'}>Permis de conduire</Link>
                        <Link className="basis-full p-4 bg-gray-200 hover:bg-primary hover:text-white text-black text-left duration-500" href={'user-verify/passeport'}>Passeport</Link>
                        <Link className="basis-full p-4 bg-gray-200 hover:bg-primary hover:text-white text-black text-left duration-500" href={'user-verify/carte-identite'}>Carte d'identité</Link>
                    </div>
                </div>
            </Dashbord>
        </>
    )
}

export default UserVerifying