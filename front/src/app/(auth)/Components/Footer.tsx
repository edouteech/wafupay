/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Image from "next/image"
import Link from "next/link"
import calque from "@/public/assets/images/Calque.png"
import login from "@/public/assets/images/Login.png"
import mail from "@/public/assets/images/mail.png"
import tel from "@/public/assets/images/tel.png"

const Footer = () => {
  return (
    <>
        <footer className="bg-blue-600 text-white py-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 justify-center items-center mt-10 gap-8 p-4">
                <div className="text-center sm:text-left px-4 h-32">
                    <div>
                        <Image src={calque} alt="WAFUPay Logo" className="mx-auto sm:mx-0 w-32 py-1" />
                        <p className="text-sm py-2">Copyright © 2023 WAFUPAY.</p>
                        <p> Tous droits réservés.</p>
                    </div>
                </div>
                <div className="xs:border-t-2 sm:border-l-2 px-4 text-center sm:text-left h-32">
                    <div>
                        <h2 className="font-semibold py-2">Contact</h2>
                        <p className="flex items-center justify-center sm:justify-start">
                            <Image src={tel} alt="tel" className="mr-2 py-2" /> +22943352098
                        </p>
                        <p className="flex items-center justify-center sm:justify-start">
                            <Image src={mail} alt="mail" className="mr-2 py-2" /> contact@wafupay.com
                        </p>
                    </div>
                </div>
                <div className="xs:border-t-2 md:border-l-2 px-4 text-center sm:text-left h-32">
                    <div>
                        <h2 className="font-semibold py-1">Mentions légales</h2>
                        <p className="py-2">Conditions d'utilisation</p>
                        <p className="py-2">Politique de confidentialité</p>
                    </div>
                </div>
                <div className="xs:border-t-2 sm:border-l-2 px-4 text-center sm:text-left h-32">
                    <div>
                        <h2 className="font-semibold py-2 mb-3">Télécharger ici</h2>
                        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" title="google">
                            <Image src={login} alt="Google Play" className="" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </>
  )
}

export default Footer