/* eslint-disable react/no-unescaped-entities */
"use client"
import UploadButton from "@/app/(dashboard)/Components/uploadButton"
import Dashbord from "../../../Components/Dashbord"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { headers } from "next/headers"

function CarteId() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter();

    //################################## VARIABLES ##############################//
    const [pics, setPics] = useState<File[]>([])
    const [auth, setAuth] = useState({headers : {Authorization : ''}})

    //################################## MOUNTED ################################//
    useEffect(() => {
        let tok = localStorage.getItem('token')
        auth.headers.Authorization = `Bearer ${tok}`
        setAuth({ headers: { Authorization: `Bearer ${tok}` } })
    }, [])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//
    const getPics = (file :File, i : number)=>{
        let p = pics.slice()
        p[i] = file
        setPics(p)
        console.log(p);
        
    }

    const submitCard = (e:any)=>{
        e.preventDefault();
        let form = new FormData()
        form.append('identity_card', pics[0]);
        form.append('identity_card_2', pics[1])
        axios.post(`${apiUrl}/submit-identity-card`, form, auth).then((resp)=>{
            if (resp.data.success) {
                router.push('/verify/end-verification')
            }
        })
    }
        

    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div>
                    <h2 className=" mt-8 mb-4 text-center text-2xl font-bold text-primary">Vérification d'identité</h2>
                    <h3 className=" mb-4 text-center text-1xl font-bold text-primary">Carte d'identité</h3>
                    <ul className="ml-16 mb-8 text-base xs:ml-0">
                        <li>Document original en taille réelle, non édité</li>
                        <li>Émis par le gouvernement</li>
                        <li>Placer le document sur un fond uni</li>
                        <li>Images lisibles, bien éclairées et colorées</li>
                        <li>Pas d'image en noir et blanc</li>
                        <li>Aucun document modifié ou expiré</li>
                    </ul>



                    <form className="w-full" onSubmit={(e)=>{submitCard(e)}}>
                        <legend className="text-base text-black text-center font-semibold">La taille réelle doit être comprise entre 10 Ko et 5 120 Ko au format jpeg ou png</legend>
                        <div className="flex justify-evenly gap-8 mx-auto w-7/12 my-4 xs:px-4 xs:w-full">
                            <UploadButton text={`${pics[0] ? pics[0].name : 'téléchargez la page avant'}`} onUpload={(file:File)=>{getPics(file,0)}}></UploadButton>
                            <UploadButton text={`${pics[1] ? pics[1].name : 'téléchargez la page arrière'}`} onUpload={(file:File)=>{getPics(file,1)}}></UploadButton>
                        </div>
                        <button className="mx-auto w-32 block p-4 m-4 bg-primary mt-8 rounded font-bold text-white">Continuer</button>
                    </form>
                    <p className="text-base text-center">En vous inscrivant vous acceptez <a href="" className="text-primary underline">notre politique de confidentialité</a>  & <a href="" className="text-primary underline">Nos termes et conditions.</a></p>
                </div>

            </Dashbord>


        </>
    )
}

export default CarteId