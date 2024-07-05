"use client";
import NavBar from "../Components/NavBar";
import React, { useState } from 'react';
import Image from "next/image";
import hero from "@/public/assets/images/hero.png";
import mission from "@/public/assets/images/mission.png";
import uemoa from "@/public/assets/images/uemoa.png";
import download from "@/public/assets/images/download.png";
import afrique from "@/public/assets/images/afrique.png";
import login from "@/public/assets/images/Login.png";
import calque from "@/public/assets/images/Calque.png";
import tel from "@/public/assets/images/tel.png";
import mail from "@/public/assets/images/mail.png";
import team from "@/public/assets/images/team.png";
import ee from "@/public/assets/images/ee.png";
import d from "@/public/assets/images/d.png";
import e from "@/public/assets/images/e.png";
import securite from "@/public/assets/images/securite.png";
import workspace from "@/public/assets/images/Workspace.png";

function About() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <NavBar />
      <div>
        <div className="flex flex-col md:flex-row items-center justify-center bg-white py-10 px-5 md:py-40 md:px-48 gap-5">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">A propos de nous</h1>
            <p className="text-base leading-relaxed text-black font-bold">
              Bienvenue chez <span className="text-blue-600 font-bold">WAPUFAY</span>, votre partenaire de confiance pour les transferts d'argent rapides, sûrs et pratiques dans la <span className="text-blue-600 font-bold">zone UEMOA</span>.
            </p>
            <p className="text-base leading-relaxed text-black font-bold">
              Chez <span className="text-blue-600 font-bold">WAPUFAY</span>, nous nous engageons à simplifier vos transactions financières, en mettant à votre disposition une plateforme moderne et conviviale, conçue pour répondre à vos besoins de transfert d'argent, où que vous soyez.
            </p>
            <p className="text-sm text-black mt-3">
              Nous nous engageons à offrir à nos utilisateurs une expérience de transfert rapide, transparente et abordable, tout en garantissant la sécurité de leurs fonds à chaque étape du processus.
            </p>
          </div>

          <div className="w-full md:w-auto justify-start">
            <Image src={hero} alt="hero" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center bg-white py-4 px-5 md:py-4 md:px-48 gap-12">
          <div className="w-full md:w-auto justify-start">
            <Image src={mission} alt="mission" />
          </div>
          <div className="w-full md:w-1/2">
            <div className="container mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold text-blue-600">Notre Mission</h2>
              <p className="text-5xl font-bold text-black mb-4">Faciliter les transactions</p>
              <p className="text-md text-black mt-4">
                Notre mission est de rendre les transferts d'argent simples, accessibles et abordables pour tous. Nous croyons que chaque transaction financière devrait être rapide, sécurisée et sans tracas. Avec WAPUFAY, nous nous efforçons de réaliser cette vision en offrant des solutions innovantes qui facilitent la vie de nos utilisateurs.
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full h-64 border mb-12 mt-32">
          <div className="relative ">
            <div className="absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50"></div>
            <Image src={team} alt="team" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center p-10 pt-20">
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold text-white my-5 leading-relaxed">Notre Engagement Envers La Sécurité</h2>
              <p className="text-white">
                Chez WAPUFAY, la sécurité des fonds de nos utilisateurs est notre priorité absolue. Nous utilisons les dernières technologies de cryptage pour protéger vos fonds.et nous nous conformons aux normes les plus strictes en matière de sécurité des données pour garantir que chaque transaction est sécurisé et protegé contre les fraudes et les cyberattaques.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Image src={securite} alt="securite" className="p-7" />
            </div>
          </div>
        </div>

        <div className="bg-cyan-500 p-8 flex flex-col items-center">
          <div className="px-5 md:px-36">
            <h1 className="text-white text-center mb-4 p-16">
              Explorez la facilité du transfert d'argent dans la zone UEMOA avec notre application innovante. Parcourez notre carte interactive pour découvrir les pays membres et profitez d'une expérience de transfert sécurisée et fluide où que vous soyez dans la région. Avec nous, votre argent est entre de bonnes mains.
            </h1>
          </div>

          <div className="flex flex-col md:flex-row content-baseline">
            <div className="w-full md:mt-28">
              <Image src={uemoa} alt="uemoa" />
            </div>
            <div className="w-full">
              <Image src={afrique} alt="afrique" />
            </div>
          </div>
        </div>

        <div className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-black mb-10">Pourquoi Choisir WAPUFAY?</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center bg-gray-100 p-4 md:px-20">
                <Image src={ee} alt="ee" className="mb-5" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-5">Rapidité</h3>
                  <p className="mt-2 text-gray-600">Avec WAPUFAY, vos transferts d'argent sont effectués en quelques instants, vous permettant ainsi d'envoyer et de recevoir de l'argent rapidement et facilement.</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-100 p-4 md:px-20">
                <Image src={d} alt="d" className="mb-5" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-5">Accessibilité</h3>
                  <p className="mt-2 text-gray-600">Notre plateforme conviviale est conçue pour être facile à utiliser, même pour les utilisateurs novices en technologie.</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-100 p-4 md:px-20">
                <Image src={e} alt="e" className="mb-5" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-blue-700 mb-5">Fiabilité</h3>
                  <p className="mt-2 text-gray-600">Vous pouvez compter sur WAPUFAY pour des transactions sans faille, à tout moment et en tout lieu, grâce à notre réseau sécurisé et fiable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10">
          <div className="mt-8 pl-20">
            <Image src={workspace} alt="workspace" className="p-16 text-center" />
          </div>
          <p className="mt-4 text-lg text-black px-5 md:px-52 text-center">
            Rejoignez-nous dès aujourd'hui sur WAPUFAY et découvrez une nouvelle façon simple et sécurisée de transférer de l'argent dans la zone UEMOA !
          </p>
        </div>

        <div>
          <div className="bg-blue-600 text-white py-8 h-auto">
            <div className="flex flex-wrap justify-center items-center mt-10 m-5">
              <div className="text-center text-sm mr-10">
                <div>
                  <Image src={calque} alt="WAFUPay Logo" className="mx-auto w-32 py-1" />
                  <p className="text-sm py-2">Copyright © 2023 WAFUPAY.</p>
                  <p>Tous droits réservés.</p>
                </div>
              </div>

              <div className="sm:w-auto text-center sm:text-left border-l-2">
                <div className="mx-10">
                  <h2 className="font-semibold py-2">Contact</h2>
                  <p className="flex items-center justify-center sm:justify-start">
                    <span className="material-icons mr-2 py-2"><Image src={tel} alt="tel" /></span> +22943352098
                  </p>
                  <p className="flex items-center justify-center sm:justify-start">
                    <span className="material-icons mr-2 py-2"><Image src={mail} alt="mail" /></span> contact@wafupay.com
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto text-center sm:text-left sm:mb-0 border-l-2 mr-8">
                <div className="mx-10">
                  <h2 className="font-semibold py-1">Mentions légales</h2>
                  <p className="py-2">Conditions d'utilisation</p>
                  <p className="py-2">Politique de confidentialité</p>
                </div>
              </div>

              <div className="sm:w-auto text-center sm:text-left border-l-2">
                <div className="mx-10">
                  <h2 className="font-semibold m-3 py-2">Télécharger ici</h2>
                  <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" title="google">
                    <Image src={login} alt="Google Play" className="w-32 mx-auto m-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
