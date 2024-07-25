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
  const {data : session } = useSession()
  const [payin_wprovider_name ,  setPayin_wprovider_name] = useState('');
  const [payin_phone_number , setPayin_phone_number] = useState('');
  const [payout_wprovider_name ,  setPayout_wprovider_name] = useState('');
  const [payout_phone_number , setPayout_phone_number] = useState('');
  const [motif , setMotif] = useState('');
  const [transRef , setTransRef] = useState('');
  const [transStatus , setTransStatus] = useState('');
  
  
  //################################## MOUNTED ################################//
  useEffect(() => {
    const token = session?.user.token ? session?.user.token : session?.user.google_token

    auth.headers.Authorization = `Bearer ${token}`
    setAuth({ headers: { Authorization: `Bearer ${token}` } })
    axios.get(`${apiUrl}/wallet-providers`, { headers: { Authorization: `Bearer ${token}` } }).then((resp) => {
      console.log(resp.data.data);
      
      setMethods(resp.data.data)
      setMethodIn(findElementById(1, resp.data.data))
      setMethodOut(findElementById(2, resp.data.data))
    })
    axios.get(`${apiUrl}/countries`).then((resp) => {
      setCountries(resp.data.data)
      setCountry(resp.data.data[0])
      
      
    })
  }, [session])

  const handleChange = (e: { target: { value: string | number } }, field: string) => {
    let fields = field.split(".")
    let f1 = fields[0]

    let f2 = fields[1]
    if (field == 'amount' && e.target.value != '') {
      let t = Object.assign({}, trans)
      t.amount = typeof (e.target.value) == 'string' ? parseInt(e.target.value) : e.target.value
      setTrans(t)

    } else if (e.target.value == '') {
      let t = Object.assign({}, trans)
      t.amount = 0
      setTrans(t)
    }
    if (field == 'sender_support_fee' && e.target.value != '') {
      let t = Object.assign({}, trans)
      t.sender_support_fee = typeof (e.target.value) == 'string' ? parseInt(e.target.value) : e.target.value
      setTrans(t)

    }
    if (f2 == "phone" || f2 == "country" || f2 == "method") {
      if (f1 == 'to') {
        let t = Object.assign({}, trans)
        t.to[f2] = e.target.value
        if (f2 == "method") {
          const methodId = parseInt(e.target.value as string, 10);
          const selectedMethod = methods.find(method => method.id === methodId);
          if (selectedMethod) {
           
            t.to.provider = selectedMethod;
            t.to.method = selectedMethod.id;

            
          }
        }
        if (f2 == "country") {
          const methodId = parseInt(e.target.value as string, 10);
          const selectedCountry = countries.find(country => country.id === methodId)
          const countrycode = selectedCountry?.country_code.substring(1)
          const phoneNumber = countrycode ? countrycode + trans.from.phone : ''

          console.log(phoneNumber);
          setPayout_phone_number(phoneNumber)

        }
        setTrans(t)
        setPayout_wprovider_name(trans.to.provider.name)
        
      } else {
        let t = Object.assign({}, trans)
        t.from[f2] = e.target.value
        if (f2 == "method") {
          const methodId = parseInt(e.target.value as string, 10);
          const selectedMethod = methods.find(method => method.id === methodId);
          if (selectedMethod) {
            t.from.provider = selectedMethod;
            t.from.method = selectedMethod.id; 
          }
        }
        if (f2 == "country") {
          const methodId = parseInt(e.target.value as string, 10);
          const selectedCountry = countries.find(country => country.id === methodId)
          const countrycode = selectedCountry?.country_code.substring(1)
          const phoneNumber = countrycode ? countrycode + trans.from.phone : ''

          console.log(phoneNumber);
          setPayin_phone_number(phoneNumber)

        }
        setTrans(t)
        setPayin_wprovider_name(trans.from.provider.name)
       
        
      }
    }

  }

  const findElementById = (id: number, list: any[]) => {
    return list.find(item => item.id === id);
  }


  const handleSubmit = async () => {
    await axios.post(`${apiUrl}/feexpay`, {
      "amount": trans.amount, 
      "payin_phone_number": trans.from.phone, 
      "payout_phone_number": trans.to.phone, 
      "payin_wprovider_id": trans.from.method, 
      "payout_wprovider_id": trans.to.method, 
      "sender_support_fee": trans.sender_support_fee,
      "payin_wprovider_name": trans.from.provider.name,
      "motif": "1"
  } ,
     auth).then((resp) => {
      if (resp.status == 200) {
        setShowM(false)
        setTransRef(resp.data)
        let myInterval = setInterval(() => {
          let status = checkStatus(resp.data)
          if (status == "SUCCESSFUL") {
            clearInterval(myInterval);
            setTransStatus(status)
          }
        }, 1000);
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
  const checkStatus = async (transactionId: string) => {
    console.log("execute checkStatus")
    await axios.get(`${apiUrl}/feexpay/${transactionId}`, auth).then((resp) => {
      console.log(resp)
      if (resp.status == 200) {
        setTransStatus(resp.data.status)
      }
    })
  }


  //################################## METHODS #################################//

  const [isReadyToSupport, setIsReadyToSupport] = useState(false);

  const handleRadioChange = (event: any) => {
    console.log(event.target.value);

    setIsReadyToSupport(event.target.value);
  };


  //################################## HTML ####################################//

  return (
    <>
      <Dashbord>

        <div className="max-w-lg mx-auto mt-16 p-6 bg-white rounded-xl shadow-md">


          <div className="mb-6">
            <label className="block font-semibold text-gray-700">De :</label>
            <div className=" text-sm m-auto text-gray-700">
              <label className="block mt-2 text-sm text-gray-700">Montant</label>
              <div className="flex items-center relative mt-2 text-sm">
                <div className="relative w-1/4 z-[5]">
                  <select className="w-full z-[5] rounded-xl block appearance-none bg-white border border-gray-300 text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.from.method} onChange={(e) => { handleChange(e, 'from.method') }}>
                    {methods.map((method) => (
                      <option key={method.id} onClick={() => { console.log(method.id) }} value={method.id} className="hover:bg-red-500 bg-white text-gray-700">{method.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                    </svg>
                  </div>
                </div>
                <input type="text" placeholder="Montant" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.amount} onChange={(e) => { handleChange(e, 'amount') }} />
                <span className="p-2 z-[5] absolute right-5 border-l-2">FCFA</span>
              </div>
              <div className="w-3/4 mx-auto">
                <label className="block mt-2">Numéro de téléphone</label>
                <div className="flex items-center relative w-full mx-auto">
                  <Select classes=" p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" id={1} countries={countries} onChange={(e) => { handleChange(e, 'from.country') }}></Select>
                  <input type="text" placeholder="+96 96 96 96" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.from.phone} onChange={(e) => { handleChange(e, 'from.phone') }} />
                </div>
              </div>
            </div>
          </div>


          <div className="mb-6">
            <label className="block font-semibold text-gray-700">Vers :</label>
            <label className="block mt-2 text-sm text-gray-700">Montant</label>
            <div className="flex items-center relative mt-2 text-sm">
              <div className="relative w-1/4 z-[5]">
                <select className="w-full z-[5] rounded-xl block appearance-none bg-white border border-gray-300 text-gray-700 p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.to.method} onChange={(e) => { handleChange(e, 'to.method') }}>
                  {methods.map((method) => (
                    <option key={method.id} onClick={() => { console.log(method.id) }} value={method.id} className="hover:bg-red-500 bg-white text-gray-700">{method.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.576 10 14.576 4 8.576z" />
                  </svg>
                </div>
              </div>

              <input type="text" placeholder="Montant" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.amount} readOnly />
              <span className="p-2 z-[5] absolute right-5 border-l-2">FCFA</span>
            </div>
            <div className=" text-sm m-auto text-gray-700 w-3/4">
              <label className="block mt-2">Numéro de téléphone</label>
              <div className="flex items-center relative">
                <Select id={1} classes=" p-4 pr-7 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" countries={countries} onChange={(e)=>{handleChange(e, 'to.country')}}></Select>
                <input type="tel" placeholder="+90 90 25 25" className="border-r w-3/4 block appearance-none bg-white border border-gray-300 w-full text-gray-700 absolute pl-32 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500" value={trans.to.phone} onChange={(e) => { handleChange(e, 'to.phone') }} />
              </div>
            </div>

          </div>

          <div className="mb-6">
          <label className="block font-semibold text-gray-700">Motif :</label>
              <textarea name="" id="" className="border-r block appearance-none bg-white border border-gray-300 w-full text-gray-700 pl-5 p-4 rounded-2xl leading-tight focus:outline-none focus:border-blue-500"  onChange={(e)=>setMotif(e.target.value)}></textarea> 
          </div>

          <div className="text-base text-gray-700">
            <p>Voulez vous supporter les frais ?</p>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input className="w-5 h-5" id="oui" type="radio" name="fee" value={1} onChange={(e) => { handleChange(e, 'sender_support_fee') }} checked={trans.sender_support_fee === 1} />
                <label htmlFor="oui" className="pl-2">Oui</label>
              </div>
              <div className="flex items-center">
                <input className="w-5 h-5" id="non" type="radio" name="fee" value={0} onChange={(e) => { handleChange(e, 'sender_support_fee') }} checked={trans.sender_support_fee === 0} />
                <label htmlFor="non" className="pl-2">Non</label>
              </div>
            </div>

          </div>

          <div className="my-6 text-sm font-bold">
            <div className="flex justify-between">
              <span>FRAIS A PRELEVER</span>
              <span className="text-red-500">{Math.ceil(((parseFloat(methodIn?.transaction_fees[0].payin_fee ? methodIn?.transaction_fees[0].payin_fee : 'O') * trans.amount) + parseFloat(methodOut?.transaction_fees[0].payout_fee ? methodOut?.transaction_fees[0].payout_fee : 'O') * trans.amount) / 100)} FCFA</span>
            </div>
            <div className="flex justify-between mt-2 bg-blue-200 p-2">
              <span className="text-gray-700">MONTANT TOTAL</span>
              <span className="text-blue-500 font-bold">{trans.amount - Math.ceil(((parseFloat(methodIn?.transaction_fees[0].payin_fee ? methodIn?.transaction_fees[0].payin_fee : 'O') * trans.amount) + parseFloat(methodOut?.transaction_fees[0].payout_fee ? methodOut?.transaction_fees[0].payout_fee : 'O') * trans.amount) / 100)} FCFA</span>
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
                  <p className="text-lg">Vous voulez envoyez <strong>{trans.amount} FCFA</strong> de <strong>{trans.from.phone}
                  </strong> vers <strong>{trans.to.phone}</strong>
                    approuvez vous la transaction?</p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-primary text-white rounded-md text-base" onClick={() => { handleSubmit() }} > Approuver </button>
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowM(false) }}> Rejeter </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'PENDING') && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction en cours de traitement
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowM(false) }}> Fermer </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'FAILED') && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction a échoué
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowM(false) }}> Fermer </button>
                </div>
              </div>
            </div>
          )}

          {(transStatus == 'SUCCESSFUL') && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                <div className="text-center">
                  <p className="text-lg">
                    Transaction a été traitée avec succès
                  </p>

                </div>
                <div className="flex justify-center">
                  <button className="px-4 py-2 mt-4 bg-red-500 text-white rounded-md text-base ml-4" onClick={() => { setShowM(false) }}> Fermer </button>
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