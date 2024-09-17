/* eslint-disable react/no-unescaped-entities */
"use client"
import welcome from "@/public/assets/images/welcome.png"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import Swal from "sweetalert2"
import NavBar from "../Components/NavBar"

function Register() {
    const apiUrl = process.env.NEXT_PUBLIC_APIURL

    const [showPassword1, setShowPassword1] = useState(false)
    const [useMail, setUseMail] = useState(true)
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
                callbackUrl: '/admin-dashboard'
            });

          console.error("------------------- Error registering user: -------------------");
          console.log(result);
          console.log("------------------- end registering user: -------------------");
            if (result?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Mauvaise entrées",
                    text: result?.error ? result?.error : ''
                });
            } else {
                router.push('/admin-dashboard')
            }
        } catch (err:any) {
            Swal.fire({
                icon: "error",
                title: "Mauvaise entrés",
                text: err ? err.error : ''
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
            <div className="flex mt-16 mx-32 gap-8 xs:block xs:m-4 xs:mb-20">
                <div>
                    <p className="font-bold text-black text-2xl xs:text-base mb-8 text-center">Bienvenue sur notre plateforme de transfert d'argent <span className="text-primary">sécurisé</span> et <span className="text-primary">rapide</span> dans la zone <span className="text-primary">UEMOA</span></p>
                    <Image alt="bienvenue" src={welcome}></Image>
                </div>
                <div className="xs:mt-4">
                    <form className="shadow-lg p-4 xs:p-4 rounded-3xl shadow-gray-400" onSubmit={handleSubmit}>
                        <legend className="mb-8 text-black font-semibold text-2xl text-center">Connexion</legend>
                        <div className="flex justify-center mb-5">
                            <button 
                                className={"border border-blue-400 px-4 py-2 rounded-s " + (useMail ? "bg-blue-400 text-white" : "")} 
                                type="button"
                                onClick={() => { setUseMail(true); handleInput({ target: { value: "" } }, "tel") }}
                            >
                                Email
                            </button>
                            <button 
                                className={"border border-blue-400 px-4 py-2 rounded-e " + (useMail ? "" : "bg-blue-400 text-white")} 
                                type="button"
                                onClick={() => { setUseMail(false); handleInput({ target: { value: "" } }, "mail") }}
                            >
                                Téléphone
                            </button>
                        </div>

                        {!useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="tel" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Téléphone</label>
                                <input type="tel" placeholder="+22956525854" className="border p-4 rounded-2xl w-full" value={user.tel} onChange={(e) => handleInput(e, "tel")} />
                            </div>
                        )}
                        {useMail && (
                            <div className="relative mb-4">
                                <label htmlFor="email" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm"> Email</label>
                                <input type="email" placeholder="johndoe@exemple.com" className="border p-4 rounded-2xl w-full" value={user.mail} onChange={(e) => handleInput(e, "mail")} />
                            </div>
                        )}
                        <div className="relative mb-4">
                            {!showPassword1 ? (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="password" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl w-full" value={user.password} onChange={(e) => handleInput(e, "password")} />
                                    <button type="button" onClick={() => setShowPassword1(true)} className="absolute top-4 right-5"><Eye /></button>
                                </>
                            ) : (
                                <>
                                    <label htmlFor="password1" className="font-semibold absolute top-[-10px] bg-white left-4 px-1 text-sm">Mot de passe</label>
                                    <input type="text" placeholder="Entrer votre mot de passe" className="border p-4 rounded-2xl w-full" value={user.password} onChange={(e) => handleInput(e, "password")} />
                                    <button type="button" onClick={() => setShowPassword1(false)} className="absolute top-4 right-5"><EyeOff /></button>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-4 text-black text-xs">
                            <button type="submit" className="bg-primary rounded-sm shadow-lg shadow-gray-300 text-white p-2 px-4"> Se connecter </button>
                            {/*  */}
                            <p>Connectez-vous autrement : </p>
                            <button type="button" onClick={(e)=>{e.preventDefault();handleGoogle()}} className="p-1 text-white border border-blue-400 rounded-full hover:bg-blue-400 w-10 h-10 flex items-center justify-center">
                                <FcGoogle className="text-primary" size={34} />
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