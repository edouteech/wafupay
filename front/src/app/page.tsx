
import portable from "@/public/assets/images/portablesLanding.png"
import paiment1 from "@/public/assets/images/handCash.png"
import paiment2 from "@/public/assets/images/pcPortable.png"
import paiment3 from "@/public/assets/images/arrowDollar.png"
import aboutImg from "@/public/assets/images/damePhone.png"
import tel1 from "@/public/assets/images/tel1.png"
import tel2 from "@/public/assets/images/tel2.png"
import tel3 from "@/public/assets/images/tel3.png"
import arrowLeft from "@/public/assets/images/arrowLeft.png"
import downloadIcon from "@/public/assets/images/downloadIcon.png"

import Image from "next/image"
import NavBar from "./(auth)/Components/NavBar"
function Home() {





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
                </div>
            </div>
        </>
    )
}
export default Home