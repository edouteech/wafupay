/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashbord";


import { useSession } from "next-auth/react"
import { Country, User } from "@/app/types/types"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import Dashboard from '../dashboard/page';


function Profil() {

    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [user, setUser] = useState<User>()
    const { data: session } = useSession()
    const [countries, setCountries] = useState<Country[]>([])
    const [data, setData] = useState<{ 'email': string, 'phone_number': string, 'first_name': string, 'last_name': string, 'country_id': string }>({ 'email': '', 'phone_number': '', 'first_name': '', 'last_name': '', 'country_id': '' })
    const apiUrl = process.env.NEXT_PUBLIC_APIURL




    useEffect(() => {


        if (session) {
            let tok = session?.user.token
            setAuth({ headers: { Authorization: `Bearer ${tok}` } })
            axios.get(`${apiUrl}/token/verify`, { headers: { Authorization: `Bearer ${tok}` } }).then((resp) => {
                console.log(resp.data);
                let use = resp.data.data
                setUser(resp.data.data)
                setData({ email: use.email, phone_number: use.phone_num.substring(4, use.phone_num.length), first_name: use.first_name, last_name: use.last_name, country_id: use.country_id })
            })
            axios.get(`${apiUrl}/countries`).then((resp) => {
                setCountries(resp.data.data)
            })
        }

    }, [session, setAuth, setUser, apiUrl]);


    return (
        <>
            <Dashbord>
                <h2 className="text-2xl font-bold text-black mb-12 mt-12 text-center">Mes informations personnelles</h2>

                <div className="max-w-2xl mx-auto mt-10 p-1 bg-white rounded-2xl shadow-md">

                    <div className="mb-4">
                        <label className="flex items-center p-4 w-full border-b border-black text-gray-400 text-base font-bold mb-2">
                            Prenom
                            <input
                                className="p-4 w-full focus-visible:outline-none focus:border-b-2 focus:border-primary ml-2 text-black text-right"
                                id="nom"
                                type="text"
                                value="Romaric"
                                readOnly
                                placeholder=""
                            />
                        </label>
                    </div>

                    <div className="mb-4" >
                        <label className="flex items-center p-4 w-full border-b border-black text-gray-400 text-base font-bold mb-2" htmlFor="prenom">
                            Nom

                            <input
                                className="p-4 w-full focus-visible:outline-none focus:border-b-2 focus:border-primary text-black text-right"
                                id="prenom"
                                type="text"
                                value="Edoutech"
                                readOnly
                                placeholder=""
                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center p-4 w-full border-b border-black text-gray-400 text-base font-bold mb-2" htmlFor="email">
                            Email

                            <input
                                className="p-4 w-full focus-visible:outline-none focus:border-b-2 focus:border-primary text-black text-right"
                                id="email"
                                type="email"
                                value="test@test.com"
                                readOnly
                                placeholder=""

                            />
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center p-4 w-full border-black text-gray-400 text-base font-bold mb-2" htmlFor="phone">


                           
                                <div className="flex items-center justify-center w-10 ml-2 ">
                                    <img
                                        src="https://flagcdn.com/w20/bj.png"
                                        alt="Benin Flag"
                                        className="w-8 h-6"

                                    />
                                </div>
                                <input
                                    className="p-3 w-full focus-visible:outline-none focus:border-b-2 focus:border-primary  text-black text-right "
                                    id="phone"
                                    type="text"
                                    value="96 58 12 36"
                                    readOnly
                                    placeholder=""

                                />

                            
                        </label>
                    </div>

                </div>
            </Dashbord >

        </>

    );
}


export default Profil;
