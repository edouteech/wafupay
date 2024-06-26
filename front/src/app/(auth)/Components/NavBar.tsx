
import Image from "next/image"
import logo from "../../../../public/assets/images/42d0a4cc6de6abf1334da470e3c56a69.png"
import playstore from "../../../../public/assets/images/google-play.svg"

function NavBar() {



    return (
        <>
            <div className="text-[19px] flex bg-primary text-white items-center justify-between pl-48 pr-32">
                <div className="flex bg-white p-2 m-3 rounded-xl items-center">
                    <Image alt="logo" className="w-[143px]" src={logo}></Image>
                </div>
                <ul className="py-2 px-8 flex border-x-2 gap-8 border-gray-200">
                    <li>Se connecter</li>
                    <li>à propos</li>
                    <li>Contact</li>
                </ul>
                <div className="flex items-center gap-4 bg-white p-2 text-primary rounded-lg">
                    <Image width={20} src={playstore} alt="logo playstore"></Image>
                    Google Play
                </div>
            </div>
        </>
    )
}

export default NavBar