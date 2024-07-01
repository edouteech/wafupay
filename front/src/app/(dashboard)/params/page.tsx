"use client"
import axios from "axios"
import { ChevronDown, ChevronRight } from "lucide-react"
import Dashbord from "../Components/Dashbord"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Country, User } from "@/app/types/types"
import mtnmomo from '@/public/assets/images/mtnmomo.png'


function Parameters() {
    //################################## CONSTANTES #############################//



    //################################## VARIABLES ##############################//
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    const [editProfilOpen, setEditProfilOpen] = useState(false);
    const [editPasswordOpen, setEditPasswordlOpen] = useState(false);
    const [editAuthentification, setEditAuthentification] = useState(false);
    const [user, setUser] = useState<User>()
    const { data: session } = useSession()
    const [countries, setCountries] = useState<Country[]>([])
    const [data, setData] = useState<{ 'email': string, 'phone_number': string, 'first_name': string, 'last_name': string, 'country_id': string }>({ 'email': '', 'phone_number': '', 'first_name': '', 'last_name': '', 'country_id': '' })
    const apiUrl = process.env.NEXT_PUBLIC_APIURL


    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//
    useEffect(() => {

        if (session) {
            let tok = session?.user.token
            setAuth({ headers: { Authorization: `Bearer ${tok}` } })
            axios.get(`${apiUrl}/token/verify`, { headers: { Authorization: `Bearer ${tok}` } }).then((resp) => {
                console.log(resp.data);
                let use = resp.data.data
                setUser(resp.data.data)
                setData({ 'email': use.email, 'phone_number': use.phone_num.substring(4, use.phone_num.length), 'first_name': use.first_name, 'last_name': use.last_name, 'country_id': use.country_id })
            })
            axios.get(`${apiUrl}/countries`).then((resp) => {
                setCountries(resp.data.data)
            })
        }
    }, [session])


    //################################## METHODS #################################//

    const toggleEditProfilForm = () => {
        setEditProfilOpen(!editProfilOpen)
    }
    const toggleEditPasswordForm = () => {
        setEditPasswordlOpen(!editPasswordOpen)
    }

    const toggleEditAuthentification = () => {
        setEditAuthentification(!editAuthentification)
    }
    const handleChange = (e: any, field: 'phone_number' | 'email' | 'first_name' | 'last_name' | 'country_id') => {
        setData((prevData) => ({
            ...prevData,
            [field]: e.target.value
        }));
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        axios.post(`${apiUrl}/user/update-profile`, data, auth)
    }





    //################################## HTML ####################################//
    return (
        <>
            <Dashbord>
                <h2 className="text-center text-xxl text-black font-bold mb-6">Paramètres</h2>
                <div className="flex items-center justify-center pt-10 bg-gray-100">
                    <div className="bg-white text-black shadow-md rounded-lg p-10 w-[45%] overflow-hidden">
                        <ul className="space-y-5">
                            <li >
                                <button onClick={toggleEditProfilForm} className="flex justify-between items-center border-b border-black pb-2 w-full">
                                    <span className="p-3 font-bold">Éditer son profil</span>
                                    <span className="cursor-pointer"> {editProfilOpen ? <ChevronDown /> : <ChevronRight />}</span>
                                </button>
                            </li>
                            {editProfilOpen && (
                                <form className="mt-4" onClick={(e) => { handleSubmit(e) }}>
                                    <div className="mb-4">
                                        <input
                                            className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => { handleChange(e, 'last_name') }}
                                            id="lastname"
                                            name="lastname"
                                            placeholder="Nom" />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => { handleChange(e, 'first_name') }}
                                            id="firstname"
                                            name="firstname"
                                            placeholder="Prénom" />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            value={data.email}
                                            onChange={(e) => { handleChange(e, 'email') }}
                                            id="email"
                                            name="email"
                                            placeholder="Adresse mail" />
                                    </div>
                                    <div className="flex justify-between mb-4 ">
                                        <div className="relative w-4/12 z-[5]">
                                            <select className="block appearance-none bg-white border-b border-black w-full text-gray-700 p-4 mt-5 pr-7 leading-tight focus:outline-none focus:border-blue-500" value={data.country_id} onChange={(e) => { handleChange(e, 'country_id') }}>
                                                {countries.map((country) => (
                                                    <option key={country.id} value={country.id} className="hover:bg-red-500 bg-white text-gray-700">{country.country_code} {country.slug}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <input
                                            className="p-5 text-center w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            value={data.phone_number}
                                            onChange={(e) => { handleChange(e, 'phone_number') }}
                                            id="phone_num"
                                            name="phone_num"
                                        />

                                    </div>
                                    {/* <div className="mb-4">
                                        <input
                                            className="p-5 text-center w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            id="password"
                                            name="password"
                                            placeholder="Veuillez saisir votre mot de passe pour confirmer" />
                                    </div> */}
                                    <div className="mb-4 flex justify-center">
                                        <button className="bg-primary text-white px-4 py-2 rounded-md">Enregistrer</button>
                                    </div>
                                </form>
                            )}
                            <li>
                                <button onClick={toggleEditPasswordForm} className="flex justify-between items-center border-b border-black pb-2 w-full">
                                    <span className="p-3 font-bold">Changer de mot de passe</span>
                                    <span className="cursor-pointer"> {editPasswordOpen ? <ChevronDown /> : <ChevronRight />}</span>
                                </button>
                            </li>
                            {editPasswordOpen && (
                                <form className="mt-4">
                                    <div className="mb-4 ">
                                        <input
                                            className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            id="actual_mdp"
                                            name="actual_mdp"
                                            placeholder="Mot de passe actuel" />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            className="p-5 w-full focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            id="new_mdp"
                                            name="new_mdp"
                                            placeholder="Nouveau mot de passe" />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                            type="text"
                                            id="confirm_mdp"
                                            name="confirm_mdp"
                                            placeholder="Confirmer le mot de passe" />
                                    </div>
                                    <div className="mb-4 flex justify-center">
                                        <button className="bg-primary text-white px-4 py-2 rounded-md">Enregistrer</button>
                                    </div>
                                </form>
                            )}
                            <li>
                                <button onClick={toggleEditAuthentification} className="flex justify-between items-center border-b border-black pb-2 w-full">
                                    <span className="p-3 font-bold">Authentification à double valeur</span>
                                    <span className="cursor-pointer"> {editAuthentification ? <ChevronDown /> : <ChevronRight />}</span>
                                </button>
                            </li>
                            {editAuthentification && (
                                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                    <div className="mb-6">
                                        <p className="text-gray-600 text-sm mt-2">Pour plus de sécurité, activez l'authentification en deux étapes. Cela nécessitera un code pin lorsque vous vous connectez sur un téléphone ou un ordinateur</p>
                                    </div>
                                    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-6">Commencer</button>
                                    <div>
                                        <h4 className="text-center text-lg bold-black font-bold mb-4">Choisissez votre méthode</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <input type="checkbox" id="extraProtection" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <label htmlFor="extraProtection" className="text-black-800">Protection supplémentaire</label>
                                            </div>
                                            <p className="pl-8 text-sm text-gray-500">Nous vous demanderons votre mot de passe plus un code de connexion chaque fois que nous remarquerons une connexion inhabituelle</p>
                                            <div className="flex items-center space-x-3 mt-4">
                                                <input type="checkbox" id="smsMessage" className="form-checkbox h-5 w-5 text-blue-600" />
                                                <label htmlFor="smsMessage" className="text-black-800">Via SMS Message</label>
                                            </div>
                                            <p className="pl-8 text-sm text-gray-500">Nous vous enverrons un SMS avec un code de vérification à chaque fois que vous vous connectez via un appareil de votre choix</p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <li>
                                <button className="flex justify-between items-center">
                                    <span className="p-3 font-bold">Mode sombre</span>
                                    <input type="checkbox" className="toggle-checkbox" />
                                </button>


                            </li>
                        </ul>
                    </div>
                </div>
            </Dashbord>
        </>
    )
}

export default Parameters;