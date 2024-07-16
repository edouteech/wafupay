"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react"
import Swal from "sweetalert2";
import Dashbord from "../Components/Dashbord"



export function Home() {
    const [amount , setAmount] = useState(0);
    const [network , setNetwork] = useState();
    const [payin_PhoneNumber , setPayinPhoneNumber] = useState('');
    const [payout_PhoneNumber , setPayoutPhoneNumber] = useState('');
    const [motif , setMotif] = useState('');
    const [payoutOpen , setPayoutOpen] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const {data : session} = useSession();
    
    const token = session?.user?.token ? session?.user?.token : session?.user?.google_token;
    const key = "fp_MibmHQekhqmdMnQx4Bw2NAtI3s5no9YY3dvydensHNClw0llN7tSueydUP9IyklZ"
    // console.log(key , shop);
     
    const handleSubmit = async (e : any) => {
        e.preventDefault();
        if (amount < 100) {
            Swal.fire({
                icon: "info",
                title: "Montant invalide",
                text: "Veuillez entrer un montant supérieur ou égale à 100 XOF",
            });
        }else{
        try {
            const resp = await axios.post(`${apiUrl}/feexpay`,{payin_PhoneNumber,payout_PhoneNumber,amount,network,motif},{ headers : { Authorization: `Bearer ${token}`}});
            console.log(resp);
            if (resp.data.reason == 'LOW_BALANCE_OR_PAYEE_LIMIT_REACHED_OR_NOT_ALLOWED' && resp.data.status == 'FAILED') {
                Swal.fire({
                    icon: "error",
                    title: "Solde Insuffisant",
                    text: "Veuillez vérifier que vous posséder le montant entrer dans votre compte",
                });
            }  else if ( resp.data.status == 'PENDING')  {
                Swal.fire({
                    icon: "success",
                    title: "Message de confirmation envoyé",
                    text: "Veuillez confirmer la transaction",
                });
            }  else if ( resp.data.status == 'FAILED' && resp.data.reason == 'SENDER_ACCOUNT_NOT_ACTIVE')  {
                Swal.fire({
                    icon: "error",
                    title: "Compte Inactif",
                    text: "Vérifier si il s'agit d'un compte actif",
                });
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    }

    const tooglePayout = () => {
        setPayoutOpen(!payoutOpen)
    }

    // const handleSubmitPayout = async (e : any) => {
    //     e.preventDefault();
    //     try {
    //         const resp = await axios.post(`${apiUrl}feexpay`,{payin_PhoneNumber,payout_PhoneNumber,amount,network,motif},{
    //             headers : {
    //                 Authorization : `Bearer ${key}`
    //             }
    //         }
    //         );
    //         console.log(resp.data);
            
    //     } catch (error) {
    //         console.error(error); 
    //     }
    // }
    return(
        <>
        <Dashbord>
         <div className="flex items-center justify-center min-h-screen">
            <div >
               <form onSubmit={handleSubmit} className="flex flex-col m-4 p-3">

                        <label htmlFor="amount">Amount</label>
                        <input 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={amount}
                        name="amount" 
                        id="amount"
                        onChange={(e :any)=>setAmount(e.target.value)}
                        />

                        <label htmlFor="payin_PhoneNumber">De : </label>
                        <input 
                        className="p-2 mt-2 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={payin_PhoneNumber}
                        name="payin_PhoneNumber" 
                        id="payin_PhoneNumber"
                        onChange={(e :any)=>setPayinPhoneNumber(e.target.value)}
                        />

                        <label htmlFor="payout_PhoneNumber">A : </label>
                        <input 
                        className="p-2 mt-2 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={payout_PhoneNumber}
                        name="payout_PhoneNumber" 
                        id="payout_PhoneNumber"
                        onChange={(e :any)=>setPayoutPhoneNumber(e.target.value)}
                        />

                        <label htmlFor="network" className="mt-3">Network</label>
                        <select 
                        className="p-2 m-1 focus-visible:outline-none"
                        value={network}
                        name="network"
                        id="network"
                        onChange={(e :any)=>setNetwork(e.target.value)} > 
                        <option value="">Selectionner le Réseau</option>
                        <option value="MTN">MTN</option>
                        <option value="MOOV">MOOV</option>
                        <option value="MOOV TG">MOOV TG</option>
                        <option value="TOGOCOM TG">TOGOCOM TG</option>
                        <option value="ORANGE SN">ORANGE SN</option>
                        <option value="MTN CI">MTN CI</option>
                        </select>  

                        <label htmlFor="motif">Motif</label>
                        <textarea 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        value={motif}
                        name="motif" 
                        id="motif"
                        onChange={(e :any)=>setMotif(e.target.value)}></textarea>  

                        <button className="flex justify-center mt-3 p-3">PAYER</button>
                </form>
                {/* <button className="flex justify-center mt-3 p-3" onClick={tooglePayout}>Show Payout</button> */}
                {/* {payoutOpen && (
                     <form onSubmit={handleSubmitPayout} className="flex flex-col m-4 p-3">


                    <label htmlFor="amount">Amount</label>
                        <input 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={amount}
                        name="amount" 
                        id="amount"
                        onChange={(e :any)=>setAmount(e.target.value)}
                    />

                    <label htmlFor="phoneNumber">Phone Number</label>
                        <input 
                        className="p-2 mt-2 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={phoneNumber}
                        name="phoneNumber" 
                        id="phoneNumber"
                        onChange={(e :any)=>setPhone(e.target.value)}
                     />
                        
                     <label htmlFor="motif">Motif</label>
                        <textarea 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        value={motif}
                        name="motif" 
                        id="motif"
                        onChange={(e :any)=>setMotif(e.target.value)}></textarea>

                    <label htmlFor="network" className="mt-3">Network</label>
                        <select 
                            className="p-2 m-1 focus-visible:outline-none"
                            value={network}
                            name="network"
                            id="network"
                            onChange={(e :any)=>setNetwork(e.target.value)} > 
                            <option value="">Selectionner le Réseau</option>
                            <option value="MTN">MTN</option>
                            <option value="MOOV">MOOV</option>
                            <option value="MOOV TG">MOOV TG</option>
                            <option value="TOGOCOM TG">TOGOCOM TG</option>
                            <option value="ORANGE SN">ORANGE SN</option>
                            <option value="MTN CI">MTN CI</option>
                        </select>   

                        <button className="flex justify-center mt-3 p-3">Payout</button>
                </form>
                )} */}
            </div>
         </div>

 </Dashbord>      
        </>
    )
}
export default Home