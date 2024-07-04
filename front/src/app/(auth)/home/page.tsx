
"use client"
import NavBar from "../Components/NavBar"
import portable from "@/public/assets/images/portablesLanding.png"
import paiment1 from "@/public/assets/images/handCash.png"
import paiment2 from "@/public/assets/images/pcPortable.png"
import paiment3 from "@/public/assets/images/arrowDollar.png"
import aboutImg from "@/public/assets/images/damePhone.png"
import tel1 from "@/public/assets/images/tel1.png"
import tel2 from "@/public/assets/images/tel2.png"
import tel3 from "@/public/assets/images/tel3.png"
import arrowLeft from "@/public/assets/images/arrowLeft.png"
import uemoa from "@/public/assets/images/uemoa.png"
import download from "@/public/assets/images/download.png"
import afrique from "@/public/assets/images/afrique.png"


import downloadIcon from "@/public/assets/images/downloadIcon.png";
import MTN from "@/public/assets/images/MTN.png";
import Moov from "@/public/assets/images/Moov.png";
import login from "@/public/assets/images/Login.png";
import calque from "@/public/assets/images/Calque.png";
import tel from "@/public/assets/images/tel.png";
import mail from "@/public/assets/images/mail.png";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react"; // Remplacez par l'importation réelle de vos icônes


import Image from "next/image"
function Home() {

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };


    const partners = [
        { name: 'MTN' },
        { name: 'Moov' },
        // Ajoutez d'autres partenaires ici
    ];

    const faqs = [
        {
            question: "Comment puis-je envoyer de l'argent avec WAPUFAY ?",
            answer: "Pour envoyer de l'argent avec WAPUFAY, commencez par vous connecter à votre compte utilisateur. Ensuite, choisissez l'option d'envoi d'argent et saisissez les détails du destinataire, y compris son nom, son numéro de téléphone ou son adresse e-mail. Après avoir spécifié le montant que vous souhaitez envoyer, vous aurez l'opportunité de vérifier les informations de la transaction. Une fois que tout est correct, confirmez la transaction et vous recevrez une confirmation instantanée."
        },
        {
            question: "Quels sont les frais associés aux transferts d'argent ?",
            answer: "Les frais associés aux transferts d'argent varient en fonction du montant envoyé et du pays de destination. Veuillez consulter notre grille tarifaire pour plus de détails."
        },
        {
            question: "Que faire si j'ai des problèmes avec ma transaction ?",
            answer: "Si vous rencontrez des problèmes avec votre transaction, veuillez contacter notre service client via le chat en ligne ou par téléphone pour obtenir de l'aide."
        },
        {
            question: "Comment puis-je récupérer de l'argent envoyé avec WAPUFAY si je n'ai pas de compte bancaire ?",
            answer: "Si vous n'avez pas de compte bancaire, vous pouvez récupérer l'argent envoyé avec WAPUFAY en utilisant nos points de retrait partenaires. Veuillez consulter la liste des points de retrait sur notre site web."
        }
    ];


    return (
        <>
            <NavBar></NavBar>
            <div className="relative">
                <article className="ml-48 mr-20 mt-16 flex items-center justify-center gap-4">
                    <div className="p-8 basis-1/2 bg-white shadow-lg rounded-3xl shadow-gray-400">
                        <h2 className="font-bold text-4xl text-black">
                            Transfert d'argent rapide et sûre dans la zone <span className="text-primary">UEMOA .</span>
                        </h2>
                        <p className="text-xl">
                            Découvrez une façon simple et sécurisée d'envoyer et de recevoir de l'argent dans la zone UEMOA. Notre application vous permet de transférer de l'argent instantanément, où que vous soyez.
                        </p>
                        <div className="flex items-center justify-between mt-8">
                            <button className=" hover:text-primary hover:bg-white hover:border-primary border font-bold bg-primary text-white p-4 rounded-full">Télécharger maintenant</button>
                            <button className="hover:text-white hover:bg-primary font-bold text-primary border-primary border rounded-full p-4">En savoir plus</button>
                        </div>
                    </div>
                    <div className="basis-1/2">
                        <Image className="w-full" src={portable} alt="des portables"></Image>
                    </div>
                </article>
                <div className="bg-thinBlue mt-16 left-[-50%] right-[-50%] w-full">
                    <div className="pl-48 pr-32 flex justify-between py-8">
                        <section className="w-72 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment1} alt="svg"></Image>
                                <h4 className="font-semibold text-2xl">Transferts rapides</h4>
                            </div>
                            <p className="mt-4">Envoyez de l'argent en quelques secondes seulement.</p>
                        </section>
                        <section className="w-72 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment2} alt="svg"></Image>
                                <h4 className="font-semibold text-2xl">Accessibilité</h4>
                            </div>
                            <p className="mt-4">Disponible 24h/24 et 7j/7, depuis votre téléphone ou votre ordinateur.</p>
                        </section>
                        <section className="w-72 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment3} alt="svg"></Image>
                                <h4 className="font-semibold text-2xl">Tarifs compétitifs</h4>
                            </div>
                            <p className="mt-4">Des frais de transaction minimes, sans surprises.</p>
                        </section>
                    </div>
                </div>
                <div className="flex ml-16 mr-32 gap-8 mt-16">
                    <div className="basis-1/2">
                        <Image src={aboutImg} alt="une dame qui sourit dans un téléphone"></Image>
                    </div>
                    <div className="basis-1/2 shadow-lg shadow-gray-500 my-4 bg-white p-8 rounded-3xl text-xl">
                        <p className="">
                            Découvrez la simplicité à son meilleur avec notre application de transfert d'argent.
                            Conçu avec une interface intuitive et conviviale, elle vous permet d'envoyer et de recevoir de l'argent en quelques clics seulement. Plus besoin de complications ni de longs processus  notre plateforme simplifiée vous guide à travers chaque étape, vous offrant une expérience sans tracas, que vous soyez un utilisateur occasionnel ou expérimenté.
                            Avec <span className="text-primary font-bold">WAFUPAY</span> , le transfert d'argent devient un jeu d'enfant, vous permettant de réaliser vos transactions rapidement et en toute confiance.
                        </p>
                    </div>
                </div>
                <div className="w-full px-32 mt-16">
                    <article className="w-full text-center">
                        <h3 className="font-bold text-6xl text-black">Simple et facile à utiliser</h3>
                        <p className="m-2 font-bold text-xl">Assurez la sécurité de vos transactions avec WAFUPAY : 100% sécurisé, confidentiel, sans tracas !</p>
                        <div className="relative flex justify-between items-center mt-8">
                            <figure>
                                <Image src={tel1} alt="image1"></Image>
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-3xl text-black mt-4">
                                        <span>1</span>
                                        <span>Télécharger</span>
                                    </p>
                                    <p>
                                        Obtenez rapidement l'application WAPUFAY depuis l'App Store ou Google Play Store. C'est gratuit et facile !
                                    </p>
                                </figcaption>
                            </figure>
                            <Image src={arrowLeft} alt="image1"></Image>
                            <figure>
                                <Image src={tel2} alt="image2"></Image>
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-3xl text-black mt-4">
                                        <span>2</span>
                                        <span>Installer</span>
                                    </p>
                                    <p>
                                        Une fois téléchargée, l'installation se fait en quelques clics. Suivez simplement les instructions à l'écran pour configurer .
                                    </p>
                                </figcaption>
                            </figure>
                            <Image className="absolute top-0" src={arrowLeft} alt="image1"></Image>
                            <figure>
                                <Image src={tel3} alt="image3"></Image>
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-3xl text-black mt-4">
                                        <span>3</span>
                                        <span>Utiliser</span>
                                    </p>
                                    <p>
                                        Avec WAPUFAY, l'envoi et la réception d'argent n'ont jamais été aussi simples. Utilisez notre interface pour effectuer des transferts rapides et sécurisés.
                                    </p>
                                </figcaption>
                            </figure>
                        </div>
                    </article>
                    <div className="flex justify-center m-20">
                        <Image src={download} alt="download"  ></Image>
                    </div>

                </div>
                <div className="bg-cyan-500 p-8 flex flex-col items-center">
                    <div className="px-36">
                        <h1 className="text-white text-center mb-4 p-16 ">
                            Explorez la facilité du transfert d'argent dans la zone UEMOA avec notre application innovante.
                            Parcourez notre carte interactive pour découvrir les pays membres et profitez d'une expérience de transfert
                            sécurisée et fluide où que vous soyez dans la région. Avec nous, votre argent est entre de bonnes mains.
                        </h1>
                    </div>

                    <div className="flex content-baseline">
                        <div className="mt-48">
                            <Image src={uemoa} alt="uemoa" ></Image>
                        </div>
                        <div>
                            <Image src={afrique} alt="afrique"></Image>
                        </div>
                    </div>
                </div>
                <div className="mt-16 px-16">

                    <div className="bg-white py-12">
                        <h2 className="text-center text-blue-600 font-bold text-2xl mb-8">NOS PARTENAIRES</h2>
                        <div className="flex justify-center space-x-8">
                            {partners.map((partner) => (
                                <div key={partner.name} className="flex items-center justify-center  bg-white shadow-lg rounded-md">
                                    <Image src={require(`../../../public/assets/images/${partner.name}.png`)} alt={partner.name} className="w-full h-full object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="px-32 mt-6">
                    <h2 className="text-center p-2 rounded-2xl font-bold text-black text-2xl">FAQ</h2>
                    <div className="m-8">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`p-4 my-3 rounded-2xl shadow-xl ${openIndex === index ? 'bg-blue-50 border border-blue-400' : 'bg-white'}`}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="font-bold text-black rounded-2xl w-full flex justify-between items-center"
                                >
                                    {faq.question}
                                    <div className="flex items-center justify-center h-8 w-8 bg-primary rounded-full">
                                        {openIndex === index ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
                                    </div>
                                </button>
                                {openIndex === index && (
                                    <p className="text-sm p-2 mt-2">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center m-28">
                    <Image src={download} alt="download"  ></Image>
                </div>
                <div className="">
                    {/* <Image src={footer} alt="partners" className=""></Image> */}

                    <div className="bg-blue-600 text-white py-8 h-60">
                        <div className="flex flex-wrap justify-center items-center  mt-10 m-5">
                            <div className="text-center text-sm mr-10">
                                <div className="">
                                    <Image src={calque} alt="WAFUPay Logo" className="mx-auto 3xl:mx-0 w-32 py-1" />
                                    <p className="text-sm py-2">Copyright © 2023 WAFUPAY.</p><p> Tous droits réservés.</p>
                                </div>
                            </div>


                            <div className="sm:w-auto text-center sm:text-left border-l-2 ">
                                <div className="mx-10">
                                    <h2 className="font-semibold py-2">Contact</h2>
                                    <p className="flex items-center justify-center sm:justify-start">
                                        <span className="material-icons mr-2 py-2"><Image src={tel} alt="tel"/></span> +22943352098
                                    </p>
                                    <p className="flex items-center justify-center sm:justify-start">
                                        <span className="material-icons mr-2 py-2"><Image src={mail} alt="mail"/></span> contact@wafupay.com
                                    </p>
                                </div>

                            </div>
                            <div className="w-full sm:w-auto text-center sm:text-left sm:mb-0 border-l-2 mr-8">

                                <div className="mx-10">
                                    <h2 className="font-semibold py-1">Mentions légales</h2>
                                    <p className="py-2">Conditions d'utilisation</p>
                                    <p  className="py-2">Politique de confidentialité</p>
                                </div>
                            </div>
                            <div className="sm:w-auto text-center sm:text-left border-l-2">
                                <div className="mx-10 ">
                                    <h2 className="font-semibold m-3 py-2">Télécharger ici</h2>
                                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" title="google">
                                        <Image src={login} alt="Google Play" className="w-32 mx-auto  m-3"/>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home