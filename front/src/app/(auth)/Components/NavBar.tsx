
"use client"
import Image from "next/image"
import logo from "@/public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "@/public/assets/images/google-play.svg"
import { Menu } from "lucide-react"
import { useState } from "react"
import Moov from "@/public/assets/images/Moov.png";
import Link from "next/link"

function NavBar() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <header className="bg-primary text-white px-4 py-2 xs:p-0">
                <div className=" xs:items-start px-3 py-2 max-w-screen-xl sm:flex items-center justify-between mx-auto relative">
                    <div className="flex bg-white p-2 rounded-xl items-center w-fit mn-3">
                        <Link href="/"><Image alt="logo" className="w-[100px]" src={logo}></Image></Link>
                    </div>
                    <button className="xs:block hidden absolute top-1 right-1" onClick={() => { setIsOpen(!isOpen) }}><Menu width={50} height={50}></Menu></button>
                    <ul  className={`${isOpen ? 'xs:block' : 'xs:hidden'} block py-2 flex gap-8 text-2xl list-none`}>
                        <li className="mb-3"><Link href="/">Accueil</Link></li>
                        <li className="mb-3"><Link href="/about">A propos</Link></li>
                    </ul>
                    <ul className={`${isOpen ? 'xs:block' : 'xs:hidden'} w-fit mr-2 flex gap-8 items-center justify-between gap-2 list-none`}>
                        <li className="xs:mb-6"><Link className="border border-white p-2 xs:text-sm text-white rounded-lg" href="/login">Connexion</Link></li>
                        <li className="xs:mb-6"><Link className="bg-white p-2 xs:text-sm text-primary rounded-lg" href="/register">Inscription</Link></li>
                    </ul>

                </div>
            </header>

        </>
    )
}

export default NavBar