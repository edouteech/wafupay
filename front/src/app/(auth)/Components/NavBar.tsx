
import Image from "next/image"
import logo from "@/public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "@/public/assets/images/google-play.svg"
import { Menu } from "lucide-react"
import { useState } from "react"

function NavBar() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className={`text-[19px] bg-primary text-white pl-48 pr-32 xs:p-0 relative`}>
                <div className="flex items-center justify-between ">

                <div className="flex bg-white p-2 m-3 rounded-xl items-center">
                    <Image alt="logo" className="w-[143px] xs:w-[100px]" src={logo}></Image>
                </div>
                <button className="xs:block hidden" onClick={() => { setIsOpen(!isOpen) }}><Menu width={50} height={50}></Menu></button>
                <ul className="xs:hidden py-2 px-8 flex border-x-2 gap-8 border-gray-200">
                    <li>Se connecter</li>
                    <li>A propos</li>
                    <li>Contact</li>
                </ul>
                <div className="xs:hidden flex items-center gap-4 bg-white p-2 xs:text-sm text-primary rounded-lg">
                    <Image width={20} src={playstore} alt="logo playstore"></Image>
                    Google Play
                </div>
                </div>
                <ul className={`${isOpen ? 'h-36' : 'h-0'} duration-500 overflow-hidden bg-primary w-full text-right pr-4 border-t border-white absolute`}>
                    <li className="mt-4">Se connecter</li>
                    <li>A propos</li>
                    <li>Contact</li>
                    <li>Télécharger</li>
                </ul>
            </div>
        </>
    )
}

export default NavBar