/* eslint-disable react/no-unescaped-entities */
"use client"
import { use, useEffect, useState } from "react"
import Dashbord from "../../Components/Dashbord"
import { useRouter } from "next/navigation"
import axios from "axios"
import mtnmomo from "@/public/assets/images/mtnmomo.png"
import Image from "next/image"
// import qsdf from "@/"
import { Country, WProvider } from "@/app/types/types"
import Swal from "sweetalert2"
import Link from "next/link"
import Select from "../../Components/Select"
import { count } from "console"
import { useSession } from "next-auth/react"

function Mobile() {
  //################################## CONSTANTES #############################//
  const apiUrl = process.env.NEXT_PUBLIC_APIURL
  const router = useRouter()
  const [auth, setAuth] = useState({ headers: { Authorization: '' } })

  //################################## VARIABLES ##############################//
  const [methods, setMethods] = useState<WProvider[]>([]);
  const [methodIn, setMethodIn] = useState<WProvider>()
  const [methodOut, setMethodOut] = useState<WProvider>()
  const [countries, setCountries] = useState<Country[]>([])
  const [country, setCountry] = useState<Country>()
  const [trans, setTrans] = useState<{ to: { "country": number | string, "phone": string | number, "method": number | string, "provider" :{"name" : string}}, from: { "country": number | string, "phone": string | number, "method": number | string,"provider" :{"name" : string} }, amount: number, sender_support_fee: number }>({ from: { "country": 1, "phone": '', method: 2, "provider" : {name : ''} }, to: { "country": 1, "phone": '', method: 1, "provider" :{name : ''} }, amount: 0, sender_support_fee: 0 })
  const [showM, setShowM] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const {data : session } = useSession()
  const [payin , setPayin] = useState({name : "", country_code : "", id: "", fee: 0});
  const [payin_phone_number , setPayin_phone_number] = useState('');
  const [payout , setPayout] = useState({name : "", country_code : "", id: "", fee: 0});
  const [payout_phone_number , setPayout_phone_number] = useState('');
  const [amount , setAmount] = useState(0);
  const [sender_support_fee , setSender_support_fee] = useState(false);
  const [totalFee , setTotalFee] = useState(0);
  const [motif , setMotif] = useState('1');
  const [transRef , setTransRef] = useState('');
  const [transStatus , setTransStatus] = useState('');
  
  
  //################################## MOUNTED ################################//
  useEffect(() => {
    const token = session?.user.token ? session?.user.token : session?.user.google_token

    if (token) {
      auth.headers.Authorization = `Bearer ${token}`
      setAuth({ headers: { Authorization: `Bearer ${token}` } })
      axios.get(`${apiUrl}/wallet-providers`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        console.log("methods : ", response.data.data);
        
        setMethods(response.data.data)
        setMethodIn(findElementById(1, response.data.data))
        setMethodOut(findElementById(2, response.data.data))
      })
      axios.get(`${apiUrl}/countries`).then((response) => {
        setCountries(response.data.data)
      })
    }
  }, [session])

  useEffect(() => {
    let fees =  Math.ceil((payin.fee + payout.fee) / 100 * amount)
    setTotalFee(fees)
  }, [payin.fee, payout.fee, amount]);

  const handleChange = (info, setter) => {
    setter(info)
  }

  const findElementById = (id: number, list: any[]) => {
    return list.find(item => item.id === id);
  }


  const handleSubmit = async () => {
    // if (payin.) {
      
    // }

    await axios.post(`${apiUrl}/transactions`, {
      "amount": amount, 
      "payin_phone_number": payin.country_code + payin_phone_number,
      "payin_wprovider_id": payin.id,
      "payin_wprovider_name": payin.name,
      "payout_wprovider_id": payout.id,
      "payout_phone_number": payout.country_code + payout_phone_number,
      "payout_wprovider_name": payout.name,
      "sender_support_fee": sender_support_fee,
      "motif": "1"
  } ,
     auth).then((response) => {
      if (response.status == 200) {
        setShowM(false)
        setShowStatus(true)
        setTransRef(response.data)
        checkStatus(response.data);
      }

    }).catch((err) => {
      console.log(err);
      if (err.response.status == 403) {
        router.push('/verify')
      }
      if (err.response.status == 402 && err.response.data.amount) {
        Swal.fire({
          icon: 'error',
          text: err.response.data.amount,
        })
      } else if (err.response.data.message) {
        Swal.fire({
          icon: 'error',
          text: err.response.data.message,
        })
      }
      if (err.response.status == 500) {
        Swal.fire({
          icon: 'error',
          title: 'Oops !',
          text: "Quelque chose s'est mal passée veuillez recommencer plus tard"
        })
      }
    })
  }

  //################################## WATCHER #################################//
  const checkStatus = async (reference: string) => {
    console.log("execute checkStatus")
    await axios.get(`${apiUrl}/payin-status/${reference}`, auth).then((response) => {
      console.log(response)
      if (response.status == 200) {
        setTransStatus(response.data.status)
        if (response.data.status == "PENDING") {
          setTimeout(() => {
            checkStatus(reference);
          }, 5000);
        }else if (response.data.status == "SUCCESSFUL") {
          setTransStatus(response.data.status);
          
        }
      }
    })
  }


  //################################## METHODS #################################//

  const [isReadyToSupport, setIsReadyToSupport] = useState(false);

  const handleRadioChange = (event: any) => {
    // console.log(event.target.value);

    setIsReadyToSupport(event.target.value);
  };

  const handleChangePayin = (index: number | string) => {
    let payin = methods[index]
    console.log("payin_fee : ", payin.payin_fee, "payout_fee : ", payin.payout_fee)
    setPayin({name : payin.name, country_code : payin.country.country_code, id: payin.id, fee: payin.payin_fee})
  }
  const handleChangePayout = (index: number | string) => {
    let payout = methods[index]
    console.log("payin_fee : ", payout.payin_fee, "payout_fee : ", payout.payout_fee)
    setPayout({name : payout.name, country_code : payout.country.country_code, id: payout.id, fee: payout.payout_fee})
  }


  //################################## HTML ####################################//

  return (
    <>
      <Dashbord>

        <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">


          <div className="mb-6">
            <label className="block font-semibold text-gray-700">De :</label>
            <div className=" text-sm m-auto text-gray-700">
              <label className="block mt-2 text-sm text-gray-700">Montant {payin.fee}</label>
              <div className="flex items-center relative mt-2 text-sm">
                <div className="relative w-1/4 z-[5]">
                  <select className="w-full z-[5] rounded-xl block appearance-none bg-white border border-gray-300 text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" onChange={(e) => { handleChangePayin(e.target.value) }}>
                    <option value="" className="hover:bg-red-500 bg-white text-gray-700">Sélectionnez un fournisseur</option>
                    {methods.map((method, index) => (
                      <option key={index} onClick={() => { console.log(method.id) }} value={index} className="hover:bg-red-500 bg-white text-gray-700">{method.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                    </svg>
                  </div>
                </div>
                <input type="text" placeholder="Montant" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={amount} onChange={(e) => { setAmount(e.target.value) }} />
                <span className="p-2 z-[5] absolute right-5 border-l-2">FCFA</span>
              </div>
              <div className="w-3/4 mx-auto">
                <label className="block mt-2">Numéro de téléphone </label>
                <br />
                <br />
                <div className="flex items-center relative w-full mx-auto">
                  <input type="text" placeholder="96 96 96 96" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={payin_phone_number} onChange={(e) => { setPayin_phone_number(e.target.value) }} />
                  <div className="flex absolute left-3 items-center gap-1">
                    {payin.country_code && ( 
                      <>
                        <Image src={require(`@/public/assets/images/${payin.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                        <strong className="text-xl font-semibold">{payin.country_code}</strong>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="mb-6">
            <label className="block font-semibold text-gray-700">Vers :</label>
            <label className="block mt-2 text-sm text-gray-700">Montant {payout.fee}</label>
            <div className="flex items-center relative mt-2 text-sm">
              <div className="relative w-1/4 z-[5]">
                <select className="w-full z-[5] rounded-xl block appearance-none bg-white border border-gray-300 text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" onChange={(e) => { handleChangePayout(e.target.value) }}>
                  <option value="" className="hover:bg-red-500 bg-white text-gray-700">Sélectionnez un fournisseur</option>
                  {methods.map((method, index) => (
                    <option key={index} onClick={() => { console.log(method.id) }} value={index} className="hover:bg-red-500 bg-white text-gray-700">{method.name}</option>
                    // <option key={method.id} onClick={() => { console.log(method.id) }} value={method.id} className="hover:bg-red-500 bg-white text-gray-700">{method.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                  </svg>
                </div>
              </div>

              <input type="text" placeholder="Montant" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={amount} disabled />
              <span className="p-2 z-[5] absolute right-5 border-l-2">FCFA</span>
            </div>
            <div className=" text-sm m-auto text-gray-700 w-3/4">
              <label className="block mt-2">Numéro de téléphone</label>
              <div className="flex items-center relative">
                <input type="tel" placeholder="90 90 25 25" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" onChange={(e) => { setPayout_phone_number(e.target.value) }} />
                  <div className="flex absolute left-3 items-center gap-1">
                    {payout.country_code && ( 
                      <>
                        <Image src={require(`@/public/assets/images/${payout.country_code}.png`)} width={19} height="12" className="h-[14px]" alt="Country Flag" />
                        <strong className="text-xl font-semibold">{payout.country_code}</strong>
                      </>
                    )}
                  </div>
              </div>
            </div>

          </div>

          {Number(amount) >= 100000 && (
            <>
            <div className="mb-6">
            <label className="block font-semibold text-gray-700">Motif :</label>
                <textarea name="" id="" className="border-r block appearance-none bg-white border border-gray-300 w-full text-gray-700 pl-5 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500"  onChange={(e)=>setMotif(e.target.value)}></textarea> 
            </div>
            </>
          )}

          <div className="text-base text-gray-700">
            <p>Voulez vous supporter les frais ?</p>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input className="w-5 h-5" id="oui" type="radio" name="fee" value={1} onChange={(e) => { setSender_support_fee(1) }} checked={sender_support_fee === 1} />
                <label htmlFor="oui" className="pl-2">Oui</label>
              </div>
              <div className="flex items-center">
                <input className="w-5 h-5" id="non" type="radio" name="fee" value={0} onChange={(e) => { setSender_support_fee(0) }} checked={sender_support_fee === 0} />
                <label htmlFor="non" className="pl-2">Non</label>
              </div>
            </div>

          </div>

          <div className="my-6 text-sm font-bold">
            <div className="flex justify-between">
              <span>Total des Frais</span>
              <span className="text-red-500">{totalFee} FCFA</span>
            </div>
            <div className="flex justify-between mt-2 bg-blue-200 p-2">
              <span className="text-gray-700">MONTANT A PRELEVER</span>
              <span className="text-blue-500 font-bold">
              {sender_support_fee ? (
                <span className="text-red-500">
                  {Number(amount) + Number(totalFee)}
                </span>
              ) : (
                <span className="text-red-500">
                  {amount }
                </span>
              )}
                FCFA
                </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={() => { setShowM(true) }} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md">Effectuer</button>
          </div>
        </div>

        <div className="text-base w-1/2 mx-auto rounded-2xl overflow-hidden mt-8">
          {showM && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">Vous voulez envoyez <strong>{amount} FCFA</strong> de <strong>{payin.country_code + payin_phone_number}
                  </strong> vers <strong>{payout.country_code + payout_phone_number}</strong>
                    approuvez vous la transaction?</p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-primary text-white rounded-md text-base" onClick={() => { handleSubmit() }} > Approuver </button>
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowM(false) }}> Rejeter </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'PENDING' && showStatus ) && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction en cours de traitement
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => {   setShowStatus(false) }}> Fermer </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'FAILED' && showStatus ) && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction a échoué
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowStatus(false) }}> Fermer </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'SUCCESSFUL' && showStatus ) && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction a été traitée avec succès
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowStatus(false) }}> Fermer </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </Dashbord>


    </>
  )
}

export default Mobile