"use client"
import { ChevronDown, ChevronRight } from "lucide-react"
import Dashbord from "../Components/Dashbord"
import { useRouter } from "next/navigation"
import { useState } from "react"


function Parameters()
{
    const [editProfilOpen , setEditProfilOpen] = useState(false);
    const [editPasswordOpen , setEditPasswordlOpen] = useState(false);

    const toggleEditProfilForm = () => {
        setEditProfilOpen(!editProfilOpen)
    }
    const toggleEditPasswordForm = () => {
        setEditPasswordlOpen(!editPasswordOpen)
    }
    return(
        <>
            <Dashbord>
            <h2 className="text-center text-xxl text-black font-bold mb-6">Paramètres</h2>
               <div className="flex items-center justify-center pt-10 bg-gray-100">
                <div className="bg-white text-black shadow-md rounded-lg p-10 w-[45%] overflow-hiddens">
                    <ul className="space-y-5">
                        <li className="flex justify-between items-center border-b border-black pb-2">
                            <span className="p-3 font-bold">Éditer son profil</span>
                            <span onClick={toggleEditProfilForm} className="cursor-pointer"> {editProfilOpen ?<ChevronDown /> : <ChevronRight />}</span>
                        </li>
                        {editProfilOpen && (
                            <form className="mt-4">
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5 w-full"
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Nom" />
                                </div>
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5  w-full"
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Prénom" />
                                </div>
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5  w-full"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Adresse mail" />
                                </div>
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5 text-center w-full"
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
                        <li className="flex justify-between items-center border-b border-black pb-2">
                            <span className="p-3 font-bold">Changer de mot de passe</span>
                            <span onClick={toggleEditPasswordForm} className="cursor-pointer"> {editPasswordOpen ?<ChevronDown /> : <ChevronRight />}</span>
                        </li>
                        {editPasswordOpen && (
                            <form className="mt-4">
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5 w-full"
                                    type="text"
                                    id="actual_mdp"
                                    name="actual_mdp"
                                    placeholder="Mot de passe actuel" />
                                </div>
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5  w-full"
                                    type="text"
                                    id="new_mdp"
                                    name="new_mdp"
                                    placeholder="Nouveau mot de passe" />
                                </div>
                                <div className="mb-4 border-b border-black">
                                    <input 
                                    className="border-none p-5  w-full"
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
                        <li className="flex justify-between items-center border-b border-black pb-2">
                            <span className="p-3 font-bold">Authentification à double facteur</span>
                            <span><ChevronRight /></span>
                        </li>
                        <li className="flex justify-between items-center">
                        <span className="p-3 font-bold">Mode sombre</span>
                        <input type="checkbox" className="toggle-checkbox" />
                    </li>
                    </ul>
                </div>
               </div> 
            </Dashbord> 
       </>
    )
}
export default Parameters