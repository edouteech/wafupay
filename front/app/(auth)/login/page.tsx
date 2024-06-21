"use client"
import NavBar from "../Components/NavBar"
import Image from "next/image"
import welcome from "@/public/assets/images/welcome.png"
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
    const [user, setUser] = useState<{"mailOrTel" : string, "password" :string}>({"mailOrTel" : "","password" : ""})



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
                    <Image alt="bienvenue" src={welcome}></Image>
                </div>
                <div>
                    <form action="" className="shadow-lg p-12 rounded-3xl shadow-gray-400" onSubmit={(e)=>{handleSubmit(e)}}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Connexion</legend>
                        <div className="relative mb-4">
                            <label htmlFor="last_name" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">E-mail ou Téléphone</label>
                            <input type="text" placeholder="johndoe@exemple.com" className="border p-4 rounded-2xl" value={user.mailOrTel} onChange={(e)=>{handleInput(e, "mailOrTel")}}/>
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

                        <div className="flex flex-col items-center gap-4 text-black text-xs">
                            <button className="bg-primary rounded-sm shadow-lg shadow-gray-300 text-white p-2 px-4"> Se connecter </button>
                            <span>Vous avez déjà un compte ? <Link href={'/register'} className="text-sm text-primary">Créer un compte</Link></span>
                            <Link href={'/login'} className="text-sm text-primary">Mot de passe oublier</Link>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Register