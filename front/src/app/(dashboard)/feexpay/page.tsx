"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react"
import Swal from "sweetalert2";



export function Home() {
    const [amount , setAmount] = useState();
    const [network , setNetwork] = useState();
    const [phone , setPhone] = useState();
    const [fullname , setFullname] = useState();
    const [email , setEmail] = useState();
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const {data : session} = useSession();

    const token = session?.user?.token ? session?.user?.token : session?.user?.google_token;

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        try {
            const resp = await axios.post(`${apiUrl}/feexpay`,{amount,network,phone,email,fullname},{ headers : { Authorization: `Bearer ${token}`}});
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
    const handleSubmitWeb = async (e : any) => {
        e.preventDefault();
        try {
            const resp = await axios.post(`${apiUrl}payWeb`);
            console.log(resp.data);
            
        } catch (error) {
            console.error(error); 
        }
    }
    return(
        <>
         <div className="flex items-center justify-center min-h-screen">
            <div >
               <form onSubmit={handleSubmit} className="flex flex-col m-4 p-3">
            
                     <label htmlFor="amount">Full Name</label>
                        <input 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={fullname}
                        name="fullname" 
                        id="fullname"
                        onChange={(e :any)=>setFullname(e.target.value)}
                     />
                        <label htmlFor="amount">Email</label>
                        <input 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={email}
                        name="email" 
                        id="email"
                        onChange={(e :any)=>setEmail(e.target.value)}
                        />
                        <label htmlFor="amount">Amount</label>
                        <input 
                        className="p-2 m-1 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={amount}
                        name="amount" 
                        id="amount"
                        onChange={(e :any)=>setAmount(e.target.value)}
                        />
                        <label htmlFor="amount">Phone Number</label>
                        <input 
                        className="p-2 mt-2 border-b border-black focus-visible:outline-none"
                        type="text" 
                        value={phone}
                        name="phone" 
                        id="phone"
                        onChange={(e :any)=>setPhone(e.target.value)}
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
                        <button className="flex justify-center mt-3 p-3">Paiement local</button>
                </form>
            </div>
         </div>

                
        </>
    )
}
export default Home