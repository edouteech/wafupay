"use client"
import { useRouter } from "next/navigation"
import { use, useState } from "react";
import { Eye, EyeOff, icons } from "lucide-react";
import NavBar from "../Components/NavBar";
import nPassword from "@/public/assets/images/modifPwd.png";
import Image from "next/image";
import InputLabel from "@/app/(dashboard)/Components/InputLabel";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";




function NewPassword() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()

    //################################## VARIABLES ##############################//
    const [showCvv, setShowCvv] = useState(false)
    const [data, setData] = useState<{ password1: string, show1: boolean, password2: string, show2: boolean }>({ password1: '', show1: false, password2: '', show2: false })

    //################################## MOUNTED ################################//



    //################################## WATCHER #################################//



    //################################## METHODS #################################//

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // axios.post(`${apiUrl}/password/forgot`, { "email": email })
        //     .then((resp) => {
        //         console.log(resp)
        //         if (resp.status == 200) {
        //             console.log(resp.data);
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'code envoyé',
        //                 text: resp.data.message
        //             })
        //             // router.push(`/mail-verification?mail=${resp.data.data[0].email}`)
        //         }

        //     })
        //     .catch((err) => {
        //         // console.error('Error registering user:', err);
        //         if (err.response.status == 403) {
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: err.response.data.message,
        //                 text: 'Ce mail ne correspond à aucun compte, veuillez le vérifier et rééssayer'
        //             })
        //         }
        //     });
    };

    const handleChange = (e: any, field: 'password1' | 'password2') => {
        setData((prevData) => ({
            ...prevData,
            [field]: e.target.value
        }));
    }

    const handleBol = (value : boolean, field : 'show1' | 'show2')=>{
        setData((prevData) => ({
            ...prevData,
            [field]: value
        }));
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
                            <InputLabel type={`${data.show1 ? 'text' : 'password'}`} id="lavel" label="Nouveau mot de passe" value={data.password1} onChange={(e)=>{handleChange(e, 'password1')}}></InputLabel>
                            <button onClick={() => { handleBol(!data.show1, 'show1') }} className="z-10">
                                {data.show1 && (
                                    <EyeOff className="absolute top-4 right-5"></EyeOff>
                                )}
                                {!data.show1 && (
                                    <Eye className="absolute top-4 right-5"></Eye>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <InputLabel type={`${data.show2 ? 'text' : 'password'}`} id="lavel" label="Confirmez le mot de passe" value={data.password2} onChange={(e)=>{handleChange(e, 'password2')}}></InputLabel>
                            <button onClick={() => { handleBol(!data.show2, "show2") }} className="z-10">
                                {data.show2 && (
                                    <EyeOff className="absolute top-4 right-5"></EyeOff>
                                )}
                                {!data.show2 && (
                                    <Eye className="absolute top-4 right-5"></Eye>
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-8">
                            <button className="hover:bg-white border border-primary hover:text-primary duration-300 mt-8 bg-primary text-white p-3 rounded">Continuer</button>
                            <Link href={'/login'} className="text-primary">Connexion</Link>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default NewPassword