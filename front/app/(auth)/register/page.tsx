"use client"
import NavBar from "../Components/NavBar"
import Image from "next/image"
import signIn from "@/public/assets/images/signIn.png"
import { useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import { strict } from "assert"
import Link from "next/link"
import axios from "axios"

function Register() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    //################################## VARIABLES ##############################//

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [user, setUser] = useState<{"first_name" : string, "last_name" : string, "email" : string, "phone_num" : number | string, "password" :string, "password2" : string}>({"first_name" : "", "last_name" : "", "email" : "", "phone_num" : "", "password" :"", "password2" : ""})



    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const handleInput = (e:{target : {value : string}}, field: string) => {
        setUser((prevUser)=>(
            {
                ...prevUser,
                [field] : e.target.value
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
            <NavBar></NavBar>

            <div className="flex mt-16 mx-32 gap-8">
                <div>
                    <p className="font-bold text-black text-2xl mb-8 text-center">Bienvenue sur notre plateforme de transfert d'argent <span className="text-primary">sécurisé</span> et <span className="text-primary">rapide</span> dans la zone <span className="text-primary">UEMOA</span></p>
                    <Image alt="bienvenue" src={signIn}></Image>
                </div>
                <div>
                    <form action="" className="shadow-lg p-12 rounded-3xl shadow-gray-400" onSubmit={(e)=>{handleSubmit(e)}}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Créer un compte</legend>
                        <div className="relative mb-4">
                            <label htmlFor="last_name" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Nom</label>
                            <input type="text" placeholder="Nom" className="border p-4 rounded-2xl" value={user.last_name} onChange={(e)=>{handleInput(e, "last_name")}}/>
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="first_name" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Prénom</label>
                            <input type="text" placeholder="Prénom" className="border p-4 rounded-2xl" value={user.first_name} onChange={(e)=>{handleInput(e, "first_name")}}/>
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Adresse e-mail</label>
                            <input type="text" placeholder="Entrer votre mail" className="border p-4 rounded-2xl" value={user.email} onChange={(e)=>{handleInput(e, "email")}}/>
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="phone_num" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Numéro de téléphone</label>
                            <input type="number" placeholder="Numéro de téléphone" className="border p-4 rounded-2xl" value={user.phone_num} onChange={(e)=>{handleInput(e, "phone_num")}}/>
                        </div>
                        <div className="relative mb-4">
                            {!showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="password" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e)=>{handleInput(e, "password")}}/>
                                    <button><Eye onClick={()=>{setShowPassword1(true)}} className="absolute top-4 right-5"></Eye></button>
                                </>
                            )}
                            {showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="text" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e)=>{handleInput(e, "password")}}/>
                                    <button><EyeOff onClick={()=>{setShowPassword1(false)}} className="absolute top-4 right-5"></EyeOff></button>
                                </>
                            )}
                        </div>
                        <div className="relative mb-4">
                            {!showPassword2 && (
                                <>
                                    <label htmlFor="password2" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Confirmer votre mot de passe</label>
                                    <input type="password" placeholder="Confirmer votre mot de passe" className="border p-4 rounded-2xl" value={user.password2} onChange={(e)=>{handleInput(e, "password2")}}/>
                                    <button><Eye onClick={()=>{setShowPassword2(true)}} className="absolute top-4 right-5"></Eye></button>
                                </>
                            )}
                            {showPassword2 && (
                                <>
                                    <label htmlFor="password2" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Confirmer votre mot de passe</label>
                                    <input type="text" placeholder="Confirmer votre mot de passe" className="border p-4 rounded-2xl" value={user.password2} onChange={(e)=>{handleInput(e, "password2")}}/>
                                    <button><EyeOff onClick={()=>{setShowPassword2(false)}} className="absolute top-4 right-5"></EyeOff></button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <button className="bg-primary rounded-lg text-white p-2 px-4"> S'inscrire </button>
                            <span className="text-black">ou</span>
                            <Link href={'/login'} className="text-sm text-primary">Connexion</Link>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Register