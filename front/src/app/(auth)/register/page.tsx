"use client"
import { useRouter } from 'next/navigation';
import NavBar from "../Components/NavBar"
import Image from "next/image"
import signIn from "@/public/assets/images/signIn.png"
import { useEffect, useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import { strict } from "assert"
import Link from "next/link"
import axios from "axios"
import { Country } from "@/app/types/types"
import { count } from "console"
import Email from 'next-auth/providers/email';
import Select from '@/app/(dashboard)/Components/Select';

function Register() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [user, setUser] = useState<{ "first_name": string, "last_name": string, "email": string, "phone_num": number | string, "password": string, "password2": string, "country_id": string | number }>({ "first_name": "", "last_name": "", "email": "", "phone_num": "", "password": "", "password2": "", "country_id": 1 })
    const [countries, setCountries] = useState<Country[]>([])
    const [country, setCountry] = useState<Country>()



    //################################## MOUNTED ################################//
    useEffect(() => {
        axios.get(`${apiUrl}/countries`).then((resp) => {
            setCountries(resp.data.data)
            setCountry(resp.data.data[0])
        })
    }, [])

    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const handleInput = (e: { target: { value: string } }, field: string) => {
        setUser((prevUser) => (
            {
                ...prevUser,
                [field]: e.target.value
            }
        ))
        if (field == 'country_id') {
            setCountry(findElementById(parseInt(e.target.value), countries))
        }
    }

    const findElementById = (id: number, list: any[]) => {
        return list.find(item => item.id === id);
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${apiUrl}/token/register`, { "first_name": user.first_name, "last_name": user.last_name, "email": user.email, "password": user.password, "confirm_password": user.password2, "phone_num": country?.country_code + "" + user.phone_num, "country_id": user.country_id })
            .then((resp) => {
                if (resp.status == 200) {
                    router.push(`/mail-verification?mail=${resp.data.data[0].email}`)
                }
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
                    <form action="" className="shadow-lg p-12 rounded-3xl shadow-gray-400" onSubmit={(e) => { handleSubmit(e) }}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Créer un compte</legend>
                        <div className="relative mb-4">
                            <label htmlFor="last_name" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Nom</label>
                            <input type="text" placeholder="Nom" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.last_name} onChange={(e) => { handleInput(e, "last_name") }} />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="first_name" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Prénom</label>
                            <input type="text" placeholder="Prénom" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.first_name} onChange={(e) => { handleInput(e, "first_name") }} />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Adresse e-mail</label>
                            <input type="text" placeholder="Entrer votre mail" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.email} onChange={(e) => { handleInput(e, "email") }} />
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <Select classes=" mb-4 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" id={typeof (user.country_id) == 'string' ? parseInt(user.country_id) : user.country_id} countries={countries} onChange={(e: { target: { value: string; }; }) => { handleInput(e, 'country_id') }}></Select>
                            <div className="relative mb-4 w-full">
                                <label htmlFor="phone_num" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Numéro de téléphone</label>
                                <input type="number" placeholder="Numéro de téléphone" className="w-full border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.phone_num} onChange={(e) => { handleInput(e, "phone_num") }} />
                            </div>
                        </div>
                        <div className="relative mb-4">
                            {!showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="password" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.password} onChange={(e) => { handleInput(e, "password") }} />
                                    <button><Eye onClick={() => { setShowPassword1(true) }} className="absolute top-4 right-5"></Eye></button>
                                </>
                            )}
                            {showPassword1 && (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="text" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.password} onChange={(e) => { handleInput(e, "password") }} />
                                    <button><EyeOff onClick={() => { setShowPassword1(false) }} className="absolute top-4 right-5"></EyeOff></button>
                                </>
                            )}
                        </div>
                        <div className="relative mb-4">
                            {!showPassword2 && (
                                <>
                                    <label htmlFor="password2" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Confirmer votre mot de passe</label>
                                    <input type="password" placeholder="Confirmer votre mot de passe" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.password2} onChange={(e) => { handleInput(e, "password2") }} />
                                    <button><Eye onClick={() => { setShowPassword2(true) }} className="absolute top-4 right-5"></Eye></button>
                                </>
                            )}
                            {showPassword2 && (
                                <>
                                    <label htmlFor="password2" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Confirmer votre mot de passe</label>
                                    <input type="text" placeholder="Confirmer votre mot de passe" className="border p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={user.password2} onChange={(e) => { handleInput(e, "password2") }} />
                                    <button><EyeOff onClick={() => { setShowPassword2(false) }} className="absolute top-4 right-5"></EyeOff></button>
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