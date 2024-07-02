"use client"
import NavBar from "../Components/NavBar"
import Image from "next/image"
import welcome from "@/public/assets/images/welcome.png"
import { useState } from "react"
import { EyeOff, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import Swal from "sweetalert2"
import { signIn } from "next-auth/react"

function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    const [showPassword1, setShowPassword1] = useState(false)
    const [useMail, setUseMail] = useState(false)
    const [user, setUser] = useState<{ "mail": string, tel: string, "password": string }>({ "mail": "", "password": "", "tel": "" })
    const router = useRouter()

    const handleInput = (e: { target: { value: string } }, field: string) => {
        setUser((prevUser) => (
            {
                ...prevUser,
                [field]: e.target.value
            }
        ))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = user.mail
        const phone_num = user.tel
        const password = user.password
        try {
            const result = await signIn("credentials", {
                email,
                phone_num,
                password,
                redirect: false,
                callbackUrl: '/dashboard'
            });
            if (result?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Mauvaise entrées",
                    text: "Aucun compte trouvé avec ces informations veuillez vérifier et rééssayer",
                });
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Mauvaise entrées",
                text: "Aucun compte trouvé avec ces informations veuillez vérifier et rééssayer",
            });
        }
    };

    const handleGoogle = async () => {
        try {
            const google_resp = await signIn('google', {
                redirect: false,
                callbackUrl: '/dashboard'
            });
            if (google_resp?.error) {
                Swal.fire({
                    icon: "error",
                    title: "Erreur de connexion",
                    text: google_resp.error,
                });
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Erreur de connexion",
                text: "Échec de la connexion avec Google, veuillez réessayer.",
            });
        }
    }

    return (
        <>
            <NavBar></NavBar>
            <div className="flex mt-16 mx-32 gap-8">
                <div>
                    <p className="font-bold text-black text-2xl mb-8 text-center">Bienvenue sur notre plateforme de transfert d'argent <span className="text-primary">sécurisé</span> et <span className="text-primary">rapide</span> dans la zone <span className="text-primary">UEMOA</span></p>
                    <Image alt="bienvenue" src={welcome}></Image>
                </div>
                <div>
                    <form className="shadow-lg p-12 rounded-3xl shadow-gray-400" onSubmit={handleSubmit}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Connexion</legend>
                        {!useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="tel" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Téléphone</label>
                                <input type="tel" placeholder="+22956525854" className="border p-4 rounded-2xl" value={user.tel} onChange={(e) => handleInput(e, "tel")} />
                            </div>
                        )}
                        {useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="email" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Email</label>
                                <input type="email" placeholder="johndoe@exemple.com" className="border p-4 rounded-2xl" value={user.mail} onChange={(e) => handleInput(e, "mail")} />
                            </div>
                        )}
                        <div className="relative mb-4">
                            {!showPassword1 ? (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="password" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e) => handleInput(e, "password")} />
                                    <button type="button" onClick={() => setShowPassword1(true)} className="absolute top-4 right-5"><Eye /></button>
                                </>
                            ) : (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="text" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl" value={user.password} onChange={(e) => handleInput(e, "password")} />
                                    <button type="button" onClick={() => setShowPassword1(false)} className="absolute top-4 right-5"><EyeOff /></button>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-4 text-black text-xs">
                            <button type="submit" className="bg-primary rounded-sm shadow-lg shadow-gray-300 text-white p-2 px-4"> Se connecter </button>
                            {!useMail ? (
                                <span>Se connecter avec <button type="button" className="text-primary" onClick={() => { setUseMail(true); handleInput({ target: { value: "" } }, "tel") }}> un email</button></span>
                            ) : (
                                <span>Se connecter avec <button type="button" className="text-primary" onClick={() => { setUseMail(false); handleInput({ target: { value: "" } }, "mail") }}> un téléphone</button></span>
                            )}
                            <button
                                type="button"
                                onClick={handleGoogle}
                                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-blue-600">
                                Connectez-vous avec Google
                            </button>
                            <span>Vous avez déjà un compte ? <Link href={'/register'} className="text-sm text-primary">Créer un compte</Link></span>
                            <Link href={'/mot-de-passe-oublier'} className="text-sm text-primary">Mot de passe oublier</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register
