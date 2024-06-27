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


function Parameters()
{
    //################################## CONSTANTES #############################//



    //################################## VARIABLES ##############################//
    const [auth,setAuth] = useState({ headers: { Authorization: '' } })
    const [editProfilOpen , setEditProfilOpen] = useState(false);
    const [editPasswordOpen , setEditPasswordlOpen] = useState(false);
    const [user, setUser] = useState<User>()
    const {data : session} = useSession()
    const [countries, setCountries] = useState<Country[]>([])
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    
    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//
    useEffect(() => {
       
        if (session) {
            let tok = session?.user.token
            setAuth({ headers: { Authorization: `Bearer ${tok}` } })
            axios.get(`${apiUrl}/token/verify`, { headers: { Authorization: `Bearer ${tok}` } }).then((resp) => {
                console.log(resp.data);
                setUser(resp.data.data)
            })
            axios.get(`${apiUrl}/countries`).then((resp) => {
                setCountries(resp.data.data)
            })
        } 
    },[session])


    //################################## METHODS #################################//

    const toggleEditProfilForm = () => {
        setEditProfilOpen(!editProfilOpen)
    }
    const toggleEditPasswordForm = () => {
        setEditPasswordlOpen(!editPasswordOpen)
    }

    const handleChange = ()

    //################################## HTML ####################################//
    return(
        <>
            <Dashbord>
            <h2 className="text-center text-xxl text-black font-bold mb-6">Paramètres</h2>
               <div className="flex items-center justify-center pt-10 bg-gray-100">
                <div className="bg-white text-black shadow-md rounded-lg p-10 w-[45%] overflow-hidden">
                    <ul className="space-y-5">
                        <li >
                            <button onClick={toggleEditProfilForm} className="flex justify-between items-center border-b border-black pb-2 w-full">
                            <span className="p-3 font-bold">Éditer son profil</span>
                            <span  className="cursor-pointer"> {editProfilOpen ?<ChevronDown /> : <ChevronRight />}</span>
                            </button>
                        </li>
                        {editProfilOpen && (
                            <form className="mt-4">
                                <div className="mb-4">
                                    <input 
                                    className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                    type="text"
                                    value={user?.last_name}
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Nom" />
                                </div>
                                <div className="mb-4">
                                    <input 
                                    className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary " 
                                    type="text"
                                    value={user?.first_name}
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Prénom" />
                                </div>
                                <div className="mb-4">
                                    <input 
                                    className="p-5 w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                    type="text"
                                    value={user?.email}
                                    id="email"
                                    name="email"
                                    placeholder="Adresse mail" />
                                </div>
                                <div className="flex justify-between mb-4 ">
                                <div className="relative w-1/4 z-[5]">
                                <select className="block appearance-none bg-white border border-gray-300 w-full text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user?.country_id} >
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
                                    value={user?.phone_num}
                                    id="phone_num"
                                    name="phone_num"
                                    />

                                </div>
                                <div className="mb-4">
                                    <input 
                                    className="p-5 text-center w-full border-b border-black focus-visible:outline-none focus:border-b-2 focus:border-primary "
                                    type="text"
                                    id="password"
                                    name="password"
                                    placeholder="Veuillez saisir votre mot de passe pour confirmer" />
                                </div>
                                <div className="mb-4 flex justify-center">
                                    <button className="bg-primary text-white px-4 py-2 rounded-md">Enregistrer</button>
                                </div>
                            </form>
                        )}
                        <li>
                        <button onClick={toggleEditPasswordForm} className="flex justify-between items-center border-b border-black pb-2 w-full">
                            <span className="p-3 font-bold">Changer de mot de passe</span>
                            <span  className="cursor-pointer"> {editPasswordOpen ?<ChevronDown /> : <ChevronRight />}</span>
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
                        <button onClick={toggleEditProfilForm} className="flex justify-between items-center border-b border-black pb-2 w-full">
                            <span className="p-3 font-bold">Authentification à double valeur</span>
                            <span  className="cursor-pointer"> {editProfilOpen ?<ChevronDown /> : <ChevronRight />}</span>
                            </button>
                        </li>
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
export default Parameters