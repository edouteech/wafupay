"use client"

import { Country, WProvider } from "@/app/types/types";
import { useEffect, useState } from "react";
import Image from 'next/image';
import welcomeImage from '../../../public/assets/images/welcome.png'; // Assurez-vous que ce chemin est correct
import { ChevronDown, ChevronRight, ChevronsRight } from "lucide-react";

type SelectProp = {
    countries?: Country[];
    providers?: WProvider[];
    id: number;
    onChange?: (e: any) => void;
    classes ? : string
};

const Select: React.FC<SelectProp> = ({ countries = [], providers = [], onChange = () => { }, id, classes = "" }) => {
    //################################## CONSTANTES #############################//   
    const word = 'welcome'

    //################################## VARIABLES ##############################//
    const [country, setCountry] = useState<Country>()
    const [provider, setProvider] = useState<WProvider>()
    const [show, setShow] = useState(false)

    //################################## MOUNTED ################################//
    useEffect(() => {
        if (countries.length) {
            providers = []
        }
        if (providers.length) {
            countries = []
        }
        if (!country) {
            setCountry(findElementById(id, countries))
        }
        if (provider) {
            setProvider(findElementById(id, providers))
        }
    }, [countries, providers])

    //################################## METHODS #################################//
    const findElementById = (id: number, list: any[]) => {
        return list.find(item => item.id === id);
    }

    const handleCountry = (country: Country) => {
        console.log("Selected country:", country);
        setCountry(country);
        onChange({target : {value:country.id}});
        setShow(!show)
    }

    //################################## HTML ####################################//

    return (
        <div className="relative">
            <div className="relative text-base font-bold text-gray-700 w-32 z-[5]">
                {country && (
                    <button className={"flex items-center gap-2 bg-white border border-gray-300 text-gray-700" + classes} onClick={() => { setShow(!show) }}>
                        <Image src={require(`../../../public/assets/images/${country.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                        <span>{country.country_code}</span>
                        <span className="duration-500 absolute right-5">
                            {show ? <ChevronDown /> : <ChevronRight />}
                        </span>
                    </button>
                )}
            </div>
            <ul className={`${show ? 'h-[275px] p-2' : 'h-0'} duration-500 overflow-hidden bg-white w-[200px] absolute z-[6]`}>
                {countries.map((country, i) => (
                    <li className="text-base font-semibold text-black hover:bg-gray-200 p-1" key={i}>
                        <button className="flex items-center gap-2" onClick={() => { handleCountry(country) }}>
                            <Image src={require(`../../../public/assets/images/${country.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                            <span>{country.slug}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Select;
