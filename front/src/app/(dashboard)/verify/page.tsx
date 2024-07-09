/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashbord"
import Image from "next/image"
import verify from "@/public/assets/images/verify.png"
import { useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import { strict } from "assert"
import Link from "next/link"
import axios from "axios"
import React from "react"
import { CircleCross } from "../Components/icons"

const Verify: React.FC = () => {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    //################################## VARIABLES ##############################//

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [user, setUser] = useState<{ "first_name": string, "last_name": string, "email": string, "phone_num": number | string, "password": string, "password2": string }>({ "first_name": "", "last_name": "", "email": "", "phone_num": "", "password": "", "password2": "" })



    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const handleInput = (e: { target: { value: string } }, field: string) => {
        setUser((prevUser) => (
            {
                ...prevUser,
                [field]: e.target.value
            }
        ))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${apiUrl}/token/register/`, { user })
            .then((resp) => {
                console.log(resp.data);
            })
            .catch((err) => {
                console.error('Error registering user:', err);
            });
    };




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="flex gap-8 items-center absolute top-0 bottom-0 left-0 right-0 backdrop-blur-lg z-20 pl-56 xs:pr-8 xs:block xs:px-4">
                    <div className="basis-1/2">

                        <Image alt="verify" src={verify}></Image>
                    </div>
                    <div className="basis-1/2">
                        <div className="bg-white flex flex-col text-black font-semibold w-96 rounded-3xl p-8 shadow-lg items-center gap-4">
                            <p className="text-4xl text-red-500 font-semi"><CircleCross className="inline"></CircleCross> ERREUR</p>
                            <p className="text-lg">Veuillez authentifier votre compte</p>
                        </div>
                        <div className="mt-4 w-96 flex justify-center">
                            <Link href={'/verify/user-verify'} className="bg-primary py-1 px-2 rounded-sm text-sm w-2/3 text-center m-auto text-white">Lancer la vérification</Link>
                        </div>
                    </div>
                </div>
            </Dashbord>
        </>
    )
}

export default Verify