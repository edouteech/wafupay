/* eslint-disable react/no-unescaped-entities */
"use client"
import NavBar from "@/app/(auth)/Components/NavBar"
import Footer from "@/app/(auth)/Components/Footer"
import aboutImg from "@/public/assets/images/damePhone.png"
import tel1 from "@/public/assets/images/tel1.png"
import tel2 from "@/public/assets/images/tel2.png"
import tel3 from "@/public/assets/images/tel3.png"
import arrowLeft from "@/public/assets/images/arrowLeft.png"
import portable from "@/public/assets/images/portablesLanding.png"
import uemoa from "@/public/assets/images/uemoa.png"
import download from "@/public/assets/images/download.png"
import afrique from "@/public/assets/images/afrique.png"

import { ChevronDown, ChevronUp, Download, UserRoundPlus } from "lucide-react"; // Remplacez par l'importation réelle de vos icônes
import React, { useState } from 'react'

import Image from "next/image"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

function Home() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index:any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const partners = [
        { name: 'MTN', file: 'logo-mtn.png' },
        { name: 'Moov', file: 'logo-moov.png' },
        { name: 'Free Money', file: 'logo-free.png' },
        { name: 'Expresso', file: 'logo-expresso.png' },
        { name: 'Tmoney', file: 'logo-tmoney.png' },
        { name: 'Wave', file: 'logo-wave.png' },
        { name: 'Wizal', file: 'logo-wizal.png' },
        { name: 'Mastercard', file: 'logo-mastercard.png' },
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

    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <>
            <NavBar></NavBar>
            <section className=" flex xs:flex-col flex-row items-center justify-center gap-4 px-4 py-8 max-w-screen-xl mx-auto">
                <div className=" max-w-full w-[32rem] p-4 basis-full sm:basis-1/2 bg-white shadow-lg rounded-2xl  mb-8">
                    <h2 className="font-bold text-2xl sm:text-4xl text-black">
                        Transfert d'argent rapide et sûre dans la zone <span className="text-primary">UEMOA.</span>
                    </h2>
                    <p className="text-lg sm:text-xl mt-4">
                        Découvrez une façon simple et sécurisée d'envoyer et de recevoir de l'argent dans la zone UEMOA. Notre application vous permet de transférer de l'argent instantanément, où que vous soyez.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8">
                        <button className="hover:text-primary hover:bg-white hover:border-primary border font-bold bg-primary text-white p-4 rounded-full mt-4 sm:mt-0">
                            Télécharger L'application
                        </button>
                        <Link href="/register" className="hover:text-white hover:bg-primary font-bold text-primary border-primary border rounded-full p-4 mt-4 sm:mt-0">
                            Créer un compte
                        </Link>
                    </div>
                </div>
                <div className="basis-full sm:basis-1/2">
                    <Image className="w-full" src={portable} alt="des portables" />
                </div>
            </section>
            {/* <section className="bg-thinBlue">
                <div className=" mt-16  max-w-screen-xl mx-auto ">
                    <div className="pl-4 pr-4 flex flex-col sm:flex-row justify-between py-8 gap-4">
                        <div className="flex-1 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment1} alt="svg" />
                                <h4 className="font-semibold text-xl sm:text-2xl">Transferts rapides</h4>
                            </div>
                            <p className="mt-4">Envoyez de l'argent en quelques secondes seulement.</p>
                        </div>
                        <div className="flex-1 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment2} alt="svg" />
                                <h4 className="font-semibold text-xl sm:text-2xl">Accessibilité</h4>
                            </div>
                            <p className="mt-4">Disponible 24h/24 et 7j/7, depuis votre téléphone ou votre ordinateur.</p>
                        </div>
                        <div className="flex-1 p-4 bg-primary rounded-3xl text-white">
                            <div className="flex items-center gap-4">
                                <Image src={paiment3} alt="svg" />
                                <h4 className="font-semibold text-xl sm:text-2xl">Tarifs compétitifs</h4>
                            </div>
                            <p className="mt-4">Des frais de transaction minimes, sans surprises.</p>
                        </div>
                    </div>
                </div>
            </section> */}
            <div className="">
                <div className="flex flex-col md:flex-row gap-8 px-4 py-8 max-w-screen-xl mx-auto">
                    <div className="basis-full sm:basis-1/2">
                        <Image src={aboutImg} alt="une dame qui sourit dans un téléphone" />
                    </div>
                    <div className="basis-full sm:basis-1/2 shadow-lg shadow-gray-500 my-4 bg-white p-8 rounded-3xl text-lg sm:text-xl">
                        <p>
                            Découvrez la simplicité à son meilleur avec notre application de transfert d'argent.
                            Conçue avec une interface intuitive et conviviale, elle vous permet d'envoyer et de recevoir de l'argent en quelques clics seulement. Plus besoin de complications ni de longs processus. Notre plateforme simplifiée vous guide à travers chaque étape, vous offrant une expérience sans tracas, que vous soyez un utilisateur occasionnel ou expérimenté.
                            Avec <span className="text-primary font-bold">WAFUPAY</span>, le transfert d'argent devient un jeu d'enfant, vous permettant de réaliser vos transactions rapidement et en toute confiance.
                        </p>
                    </div>
                </div>
                <div className="w-full px-4 sm:px-32 mt-16">
                    <article className="w-full text-center">
                        <h3 className="font-bold text-3xl sm:text-6xl text-black">Simple et facile à utiliser</h3>
                        <p className="m-2 font-bold text-lg sm:text-xl">Assurez la sécurité de vos transactions avec WAFUPAY : 100% sécurisé, confidentiel, sans tracas !</p>
                        <div className="relative flex flex-col sm:flex-row justify-between items-center mt-8">
                            <figure className="flex flex-col items-center">
                                <Image src={tel1} alt="image1" />
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-xl sm:text-3xl text-black mt-4">
                                        <span>1</span>
                                        <span>Télécharger</span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Obtenez rapidement l'application WAPUFAY depuis l'App Store ou Google Play Store. C'est gratuit et facile !
                                    </p>
                                </figcaption>
                            </figure>
                            <Image className="hidden sm:block" src={arrowLeft} alt="arrow" />
                            <figure className="flex flex-col items-center">
                                <Image src={tel2} alt="image2" />
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-xl sm:text-3xl text-black mt-4">
                                        <span>2</span>
                                        <span>Installer</span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Une fois téléchargée, l'installation se fait en quelques clics. Suivez simplement les instructions à l'écran pour configurer.
                                    </p>
                                </figcaption>
                            </figure>
                            <Image className="hidden sm:block absolute top-0" src={arrowLeft} alt="arrow" />
                            <figure className="flex flex-col items-center">
                                <Image src={tel3} alt="image3" />
                                <figcaption className="font-bold text-center">
                                    <p className="font-bold flex flex-col items-center text-xl sm:text-3xl text-black mt-4">
                                        <span>3</span>
                                        <span>Utiliser</span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        Avec WAPUFAY, l'envoi et la réception d'argent n'ont jamais été aussi simples. Utilisez notre interface pour effectuer des transferts rapides et sécurisés.
                                    </p>
                                </figcaption>
                            </figure>
                        </div>
                    </article>
                    <div className="flex justify-center my-20">
                        <Link href="/about" className="font-bold text-white bg-primary border rounded-lg p-4 mt-4 sm:mt-0">
                            Télécharger maintenant <Download className="inline ml-2" />
                        </Link>
                    </div>
                </div>
                <div className="bg-cyan-500 p-8 flex flex-col items-center ">
                    <h1 className="text-white text-center mb-4 ">
                        Explorez la facilité du transfert d'argent dans la zone UEMOA avec notre application innovante. Parcourez notre carte interactive pour découvrir les pays membres et profitez d'une expérience de transfert sécurisée et fluide où que vous soyez dans la région. Avec nous, votre argent est entre de bonnes mains.
                    </h1>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="">
                            <Image src={uemoa} alt="uemoa" />
                        </div>
                        <div className="">
                            <Image src={afrique} alt="afrique" />
                        </div>
                    </div>
                </div>
                <div className="mt-16 px-4 sm:px-16">
                    <div className="bg-white py-12">
                        <h2 className="text-center text-blue-600 font-bold text-xl sm:text-2xl mb-8">NOS PARTENAIRES</h2>
                        <Carousel plugins={[ Autoplay({delay: 2000,}), ]}>
                            <CarouselContent>
                                {partners.map((partner) => (
                                    // <div key={partner.name} className="flex items-center justify-center bg-white shadow-lg rounded-md p-4">
                                    <CarouselItem className="basis-1/6">
                                        <Image src={require(`../public/assets/images/partners/${partner.file}`)} alt={partner.name} className="w-full h-full object-contain" />
                                    </CarouselItem>
                                    // </div>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="flex flex-col sm:flex-row justify-center space-x-0 sm:space-x-8 space-y-4 sm:space-y-0">
                        </div>
                    </div>
                </div>
                <div className="px-4 mt-6">
                    <h2 className="text-center p-2 rounded-2xl font-bold text-black text-xl sm:text-2xl">FAQ</h2>
                    <div className="m-8 max-w-[800px] mx-auto">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`p-4 my-3 rounded-2xl shadow-xl ${openIndex === index ? 'bg-blue-50 border border-blue-400' : 'bg-white'}`}
                            >
                                <p
                                    onClick={() => toggleAccordion(index)}
                                    className="font-bold text-black rounded-2xl w-full flex justify-between items-start"
                                >
                                    {faq.question}
                                    <div className="flex items-center justify-center h-6 w-6 bg-primary rounded-full">
                                        {openIndex === index ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
                                    </div>
                                </p>
                                {openIndex === index && (
                                    <p className="text-sm p-2 mt-2">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center my-28 ">
                    <Link href="/about" className="font-bold text-white bg-primary border rounded-lg p-4 mt-4 sm:mt-0">
                        Créer un compte <UserRoundPlus className="inline ml-2" />
                    </Link>
                </div>
                <Footer ></Footer>
            </div>
        </>
    );
}

export default Home;
