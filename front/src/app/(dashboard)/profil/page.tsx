"use client"
import Dashbord from "../Components/Dashbord"


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
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Mes informations personnelles</h2>

                <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                    <form>
                        <div className="mb-4">
                            <label className="block border-black-700 text-black text-sm font-bold mb-2" htmlFor="nom">
                                Nom
                            </label>
                            <input
                                className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary"
                                id="nom"
                                type="text"
                                value={data.first_name}
                                readOnly
                                placeholder="Nom"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block  border-black-700 text-black text-sm font-bold mb-2" htmlFor="prenom">
                                Prénom
                            </label>
                            <input
                                className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary"
                                id="prenom"
                                type="text"
                                value={data.last_name}
                                readOnly
                                placeholder="Prenom"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block  border-black-700 text-black text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary"
                                id="email"
                                type="email"
                                value={data.email}
                                readOnly
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block  border-black-700 text-black text-sm font-bold mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <div className="flex">
                                <div className="flex items-center justify-center w-12 bg-gray-200 border border-gray-300 rounded-l-md">
                                    <img
                                        src={data.country_id}
                                        alt="Benin Flag"
                                        className="w-6 h-6"
                                    />
                                </div>
                                <input
                                    className="shadow appearance-none border rounded-r w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="phone"
                                    type="text"
                                    value={data.phone_number}
                                    readOnly
                                    placeholder="96 58 12 36"
                                    
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </Dashbord >

        </>

    );
}


export default Profil;
