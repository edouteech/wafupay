"use client"
import NavBar from "../Components/NavBar"
import Image from "next/image"
import mailVerif from "@/public/assets/images/mailVerif.png"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

function MailVarification() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [inputValues, setInputValues] = useState<string[]>(['', '', '', '', '', '']);
    const email = window.location.href.substring(45, window.location.href.length)




    //################################## MOUNTED ################################//


    //################################## WATCHER #################################//
    useEffect(()=>{
        console.log(email);
        
    },[email])


    //################################## METHODS #################################//



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
        axios.post(`${apiUrl}/token/verify-email`, { "token": inputValues.join(""), "email": email })
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

            <div className="flex mt-16 mx-32 gap-8 items-center">
                <div>
                    <p className="font-bold text-black text-2xl mb-8 text-center">Bienvenue sur notre plateforme de transfert d'argent <span className="text-primary">sécurisé</span> et <span className="text-primary">rapide</span> dans la zone <span className="text-primary">UEMOA</span></p>
                    <Image alt="bienvenue" src={mailVerif}></Image>
                </div>
                <form className="flex flex-col gap-4 shadow-lg p-8 rounded-2xl   " onSubmit={(e)=>{handleSubmit(e)}}>
                    <p className="font-bold my-4">Entrer le code envoyer à votre e-mail</p>
                    <div className="border-2 flex gap-4 p-4 rounded-xl">
                        {[...Array(6)].map((_, index) => (
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
                    <div className="flex justify-center">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg">Valider</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default MailVarification