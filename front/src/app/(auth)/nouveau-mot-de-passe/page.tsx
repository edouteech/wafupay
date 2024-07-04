"use client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, icons } from "lucide-react";
import NavBar from "../Components/NavBar";
import nPassword from "@/public/assets/images/modifPwd.png";
import Image from "next/image";
import InputLabel from "@/app/(dashboard)/Components/InputLabel";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import mailVerif from "@/public/assets/images/mailVerif.png"
import ButtonLoader from "../Components/buttonLoader"
import { error } from "console"




function NewPassword() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const pathname = usePathname()

    //################################## VARIABLES ##############################//
    const [data, setData] = useState<{ password1: string, show1: boolean, password2: string, show2: boolean }>({ password1: '', show1: false, password2: '', show2: false })
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [inputValues, setInputValues] = useState<string[]>(['', '', '', '', '', '', '']);
    const email = pathname.split("=")[1]
    const [sendLoader, setSendLoader] = useState(false)
    const [resendLoader, setResendLoader] = useState(true)
    const [timing, setTiming] = useState(60)

    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//


    const handleChange = (e: any, field: 'password1' | 'password2') => {
        setData((prevData) => ({
            ...prevData,
            [field]: e.target.value
        }));
    }

    const handleBol = (value: boolean, field: 'show1' | 'show2') => {
        setData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && index > 0 && !e.currentTarget.value) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Backspace' && !e.currentTarget.value) {
            const newInputValues = [...inputValues];
            newInputValues[index - 1] = '';
            setInputValues(newInputValues);
        }
    };

    const setRef = (el: HTMLInputElement | null, index: number) => {
        inputRefs.current[index] = el;
    };


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSendLoader(true)
        axios.post(`${apiUrl}/password/reset`, { "otp": inputValues.join(""), "email": email, "password" : data.password1, "confirm_password" : data.password2 })
            .then((resp) => {
                console.log(resp.status);
                setSendLoader(false)
                if (resp.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Votre met de passe a été modifié avec succès',
                        timer : 2000
                    })
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
                setSendLoader(false)

                if (err.code == 'ERR_BAD_REQUEST') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Mauvais code',
                        text: err.response.data.message
                    })
                }
            });
    };

    const resendVerif = () => {
        setResendLoader(false)
        axios.post(`${apiUrl}/password/forgot`, { "email": email }).then((resp) => {
            if (resp.status == 200) {
                let t = 60
                const id = setInterval(() => {
                    if (t > 1) {
                        t = t - 1
                        setTiming(t)

                    } else {
                        setResendLoader(true)
                        clearInterval(id)
                    }
                }, 1000);
            }
        })
    }



    //################################## HTML ####################################//

    return (
        <>
            <NavBar></NavBar>
            <div className="flex mt-16 mx-32 gap-8 items-center ">
                <div className="basis-7/12">
                    <p className="font-bold text-black text-2xl mb-8 text-center">Bienvenue sur notre plateforme de transfert d'argent <span className="text-primary">sécurisé</span> et <span className="text-primary">rapide</span> dans la zone <span className="text-primary">UEMOA</span></p>
                    <Image alt="un joli cadenas" src={nPassword} className="relative top-[-70px]"></Image>
                </div>
                <div className="basis-5/12">
                    <form action="" className="shadow-lg p-12 w-full rounded-3xl shadow-gray-400" onSubmit={(e) => { handleSubmit(e) }}>
                        <legend className="font-bold mb-8 text-center text-gray-700 text-xl">Mot de passe oublié</legend>
                        <div className="relative">
                            <InputLabel type={`${data.show1 ? 'text' : 'password'}`} id="lavel" label="Nouveau mot de passe" value={data.password1} onChange={(e) => { handleChange(e, 'password1') }}></InputLabel>
                            <button onClick={(e) => {e.preventDefault(); handleBol(!data.show1, 'show1') }} className="z-10">
                                {data.show1 && (
                                    <EyeOff className="absolute top-4 right-5"></EyeOff>
                                )}
                                {!data.show1 && (
                                    <Eye className="absolute top-4 right-5"></Eye>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <InputLabel type={`${data.show2 ? 'text' : 'password'}`} id="lavel" label="Confirmez le mot de passe" value={data.password2} onChange={(e) => { handleChange(e, 'password2') }}></InputLabel>
                            <button onClick={(e) => {e.preventDefault(); handleBol(!data.show2, "show2") }} className="z-10">
                                {data.show2 && (
                                    <EyeOff className="absolute top-4 right-5"></EyeOff>
                                )}
                                {!data.show2 && (
                                    <Eye className="absolute top-4 right-5"></Eye>
                                )}
                            </button>
                        </div>
                        <p className="font-bold my-4">Entrer le code envoyer à votre e-mail</p>
                        <div className="border-2 flex gap-4 p-4 rounded-xl">
                            {[...Array(7)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    ref={(el) => setRef(el, index)}
                                    value={inputValues[index]}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center justify-center gap-8">
                            <div className="flex gap-8">
                                <div className="flex justify-center relative">
                                    {sendLoader && (
                                        <span className="absolute top-0 p-3 mt-8 w-full rounded-lg bottom-0 flex justify-center items-center bg-primary">
                                            <ButtonLoader></ButtonLoader>
                                        </span>
                                    )}
                                    <button className="w-full hover:bg-white border border-primary hover:text-primary duration-300 mt-8 bg-primary text-white p-3 rounded">Continuer</button>
                                </div>
                            </div>
                            {resendLoader && (
                                <span>Vous n'avez pas reçu de message ? <span role="button" className="text-primary" onClick={() => { resendVerif() }}>cliquer ici !</span></span>
                            )}
                            {!resendLoader && (
                                <span>Vous pourrez demander un autre mail dans 00 : {timing}</span>
                            )}
                            <Link href={'/login'} className="text-primary">Connexion</Link>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default NewPassword