"use client"
import NavBar from "../Components/NavBar"
import Image from "next/image"
import welcome from "@/public/assets/images/welcome.png"
import { useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import { strict } from "assert"
import Link from "next/link"
import {useRouter} from "next/navigation"
import axios from "axios"
import Swal from "sweetalert2"

function Register() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    //################################## VARIABLES ##############################//

    const [showPassword1, setShowPassword1] = useState(false)
    const [useMail, setUseMail] = useState(false)
    const [user, setUser] = useState<{ "mail": string, tel: string, "password": string }>({ "mail": "", "password": "", "tel": "" })
    const router = useRouter()



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
        if (user.tel) {
            axios.post(`${apiUrl}/token`, { "phone_num": user.tel ? user.tel : null, "password": user.password })
            .then((resp) => {
                console.log(resp.data);
                localStorage.setItem('token', resp.data.token)
                router.push('/dashboard')
            })
            .catch((err) => {
                console.error('Error registering user:', err);
                Swal.fire({
                    icon : 'error',
                    title : 'Mauvaise entrées',
                    text : err.response.data.phone_num ? err.response.data.phone_num : err.response.data.email ? err.response.data.email : 'Aucun compte trouvé avec ces informations veuillez vérifier et rééssayer'
                })
            });
        }else {
            axios.post(`${apiUrl}/token`, {"email": user.mail ? user.mail : null, "password": user.password })
            .then((resp) => {
                console.log(resp.data);
                localStorage.setItem('token', resp.data.token)
                router.push('/dashboard')
            })
            .catch((err) => {
                console.error('Error registering user:', err);
                Swal.fire({
                    icon : 'error',
                    title : 'Mauvaise entrées',
                    text : err.response.data.phone_num ? err.response.data.phone_num : err.response.data.email ? err.response.data.email : 'Aucun compte trouvé avec ces informations veuillez vérifier et rééssayer'
                })
            });
        }
        
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
                    <form action="" className="shadow-lg p-12 rounded-3xl shadow-gray-400" onSubmit={(e) => { handleSubmit(e) }}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Connexion</legend>
                        {!useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="tel" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Téléphone</label>
                                <input type="tel" placeholder="+22956525854" className="border p-4 rounded-2xl" value={user.tel} onChange={(e) => { handleInput(e, "tel") }} />
                            </div>
                        )}
                        {useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="email" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Email</label>
                                <input type="email" placeholder="johndoe@exemple.com" className="border p-4 rounded-2xl" value={user.mail} onChange={(e) => { handleInput(e, "mail") }} />
                            </div>
                        )}
                        <div className="relative mb-4">
                            {!showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="password" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e) => { handleInput(e, "password") }} />
                                    <button><Eye onClick={() => { setShowPassword1(true) }} className="absolute top-4 right-5"></Eye></button>
                                </>
                            )}
                            {showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="text" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e) => { handleInput(e, "password") }} />
                                    <button><EyeOff onClick={() => { setShowPassword1(false) }} className="absolute top-4 right-5"></EyeOff></button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-4 text-black text-xs">
                            <button className="bg-primary rounded-sm shadow-lg shadow-gray-300 text-white p-2 px-4"> Se connecter </button>
                            {!useMail && (
                                <span>Se connecter avec <button className="text-primary" onClick={()=>{setUseMail(true); handleInput({target:{value : ""}}, "tel")}}> un email</button></span>
                            )}
                            {useMail && (
                                <span>Se connecter avec <button className="text-primary" onClick={()=>{setUseMail(false); handleInput({target:{value : ""}}, "mail")}}> un téléphone</button></span>
                            )}
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