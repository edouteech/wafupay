"use client"
import { useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import { headers } from "next/headers"
import mtnmomo from "@/public/assets/images/mtnmomo.png"
import Image from "next/image"
import { Country } from "@/app/types/types"

function Dashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    let auth = { headers: { Authorisation: '' } }

    //################################## VARIABLES ##############################//
    const [methods, setMethods] = useState([]);
    const [countries, setCountries] = useState<Country[]>([])
    const [country, setCountry] = useState<Country>()
    const [trans, setTrans] = useState<{ to: { "country": number | string, "phone": string | number }, from: { "country": number | string, "phone": string | number }, amount : number }>({ from: { "country": 1, "phone": '' }, to: { "country": 1, "phone": '' }, amount : 0 })

    //################################## MOUNTED ################################//
    useEffect(() => {
        let tok = localStorage.getItem('token')
        auth.headers.Authorisation = `Bearer ${tok}`
        // axios.get(`${apiUrl}/wallet-providers`, auth).then((resp) => {
        //     console.log(resp.data);
        // })
        axios.get(`${apiUrl}/countries`).then((resp) => {
            setCountries(resp.data.data)
            setCountry(resp.data.data[0])
        })
    }, [])

    const handleChange = (e: { target: { value: string | number } }, field: string) => {
        let fields = field.split(".")
        let f1 = fields[0]

        let f2 = fields[1]
        if (field == 'amount' && e.target.value != '') {
            let t = Object.assign({}, trans)
                t.amount = typeof(e.target.value) == 'string' ? parseInt(e.target.value) : e.target.value
                setTrans(t)
                
        }else if (e.target.value == '') {
            let t = Object.assign({}, trans)
                t.amount = 0
                setTrans(t)
        }
        if (f2 ==  "phone" || f2 ==  "country") {
            if (f1 == 'to') {
                let t = Object.assign({}, trans)
                t.to[f2] = e.target.value
                setTrans(t)
            } else {
                let t = Object.assign({}, trans)
                console.log(trans);
                t.from[f2] = e.target.value
                setTrans(t)
            }
        }

    }


    const handleSubmit = ()=>{
        axios.post(`${apiUrl}/transactions`, {}, auth).then((resp)=>{
            console.log(resp);
            
        })
    }

    //################################## WATCHER #################################//



    //################################## METHODS #################################//




    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>

                <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">
                    <div className="mb-6">
                        <label className="block font-semibold text-black">De :</label>
                        
                        <div className=" text-sm m-auto text-black">
                            <label className="block mt-2">Numéro de téléphone</label>
                            <div className="flex items-center relative">
                                <div className="relative w-1/4 z-50">
                                    <select className="block appearance-none bg-white border border-gray-300 w-full text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.from.country} onChange={(e) => { handleChange(e, 'from.country') }}>
                                        {countries.map((country) => (
                                            <option key={country.id} onClick={() => { setCountry(country) }} value={country.id} className="hover:bg-red-500 bg-white text-gray-700">{country.country_code} {country.slug}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                                        </svg>
                                    </div>
                                </div>
                                <input type="tel" placeholder="+90 90 25 25" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.from.phone} onChange={(e) => { handleChange(e, 'from.phone') }} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold text-black">Vers :</label>
                        <div className=" text-sm m-auto text-black">
                            <label className="block mt-2">Numéro de téléphone</label>
                            <div className="flex items-center relative">
                                <div className="relative w-1/4 z-50">
                                    <select className="block appearance-none bg-white border border-gray-300 w-full text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.to.country} onChange={(e) => { handleChange(e, 'to.country') }}>
                                        {countries.map((country) => (
                                            <option key={country.id} onClick={() => { setCountry(country) }} value={country.id} className="hover:bg-red-500 bg-white text-gray-700">{country.country_code} {country.slug}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                                        </svg>
                                    </div>
                                </div>
                                <input type="text" placeholder="+96 96 96 96" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.to.phone} onChange={(e) => { handleChange(e, 'to.phone') }} />
                            </div>
                        </div>
                    </div>
                    <label htmlFor="amount" className="text-black font-semibold mb-4"> Montant </label>
                    <div className="flex items-center relative mt-2 text-sm">
                            <Image alt="logo mtn momo" src={mtnmomo} className="w-12 z-50 ml-2 rounded-xl"></Image>
                            <input type="text" placeholder="Montant" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-20 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.amount} onChange={(e) => { handleChange(e, 'amount') }} />
                            <span className="p-2 z-50 absolute right-5 border-l-2">FCFA</span>
                        </div>

                    <div className="my-6 text-sm">
                        <div className="flex justify-between">
                            <span>FRAIS A PRELEVER</span>
                            <span className="text-red-500">1 000 FCFA</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span>MONTANT TOTAL</span>
                            <span className="text-blue-500 font-bold">{trans.amount + 1000} FCFA</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={()=>{handleSubmit()}} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md">Effectuer</button>
                    </div>
                </div>

                <div>

                </div>

            </Dashbord>


        </>
    )
}

export default Dashboard