/* eslint-disable react/no-unescaped-entities */
"use client"
import Dashbord from "../Components/Dashbord"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Mobile, Payement, Manymen, Increase } from "../Components/icons"

import Select from "../Components/Select"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from "next/link";

function Dashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const { data: session } = useSession()
    const [auth, setAuth] = useState({ headers: { Authorization: '' } })
    // const auth = { headers: { Authorization: `Bearer ${session?.user.token}` } }
    //################################## VARIABLES ##############################//

    // const {data : session} = useSession()
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [numTransactions, setNumTransactions] = useState(0);

    const [transactionCount, setTransactionCount] = useState(0);

    useEffect(() => {
        if (!session) {
            return
        }
        setAuth({ headers: { Authorization: `Bearer ${session?.user.token}` } })
        axios.get(`${apiUrl}/transactions`, { headers: { Authorization: `Bearer ${session?.user.token}` } }).then((response) => {
            setTransactions(response.data.data.data)
            setTotalTransactions(response.data.data.totalTransactions);
            setNumTransactions(response.data.data.numTransactions);
        })
    }, [session])
    // useEffect(() => {
    //     // Remplacez cette URL par l'endpoint réel de votre API
    //     const fetchTransactions = async () => {
    //         if ( auth && auth.headers ) {

    //             try {
    //                 const response = await axios.get(`${apiUrl}/transactions`, auth);
    //                 console.log(response.data);
    //                 setTransactions(response.data.transactions);
    //                 setTotalTransactions(response.data.totalTransactions);
    //                 setNumTransactions(response.data.numTransactions);
    //             } catch (error) {
    //                 console.error('Erreur de récupération des données:', error);
    //             }
    //         }
    //     };

    //     fetchTransactions();

    // }, [auth]);


    useEffect(() => {
        // Fetch data from the JSON file in the public folder
        // fetch('/transactions.json')
        //     .then(response => response.json())
        //     .then(data => {
        //         setTransactions(data.transactions);
        //         setTotalTransactions(data.totalTransactions);
        //         setTransactionCount(data.transactionCount);
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
    }, []);
    //################################## MOUNTED ################################//
    // useEffect(()=>{
    //     if (session?.user) {
    //         axios.post(`${apiUrl}/user/update-profile`, {"email" : "lodira6108@cutxsew.com", "first_name" : session?.user.firstname, "last_name" : session?.user.lastname, "phone_number" : session?.user.phone_num, "country_id" : 1}, auth)
    //     }
    // },[session])


    //################################## WATCHER #################################//



    //################################## METHODS #################################//



    //################################## HTML ####################################//

    return (
        <>
            <Dashbord>
                <div className="min-h-screen p-6 bg-gray-100">
                    <div className="flex items-center gap-16 mb-28 h-42 pr-20 xs:flex-col xs:p-0 xs:gap-4 xs:mb-8">
                        <div className="bg-blue-500 text-white text-center p-4 rounded-xl shadow-lg w-64 ml-32 xs:m-0">
                            <div className="">
                                <div className="flex justify-center mb-7 my-4 ">
                                    <Mobile></Mobile>
                                </div>
                                <span className="text-lg font-medium">Paiement mobile</span>
                            </div>
                        </div>

                        <div className="bg-white p-3 shadow-md rounded-xl flex items-center justify-between h-2/4 w-3/5 ml-6 xs:w-full xs:m-0">
                            <div>
                                <p className="text-sm text-gray-500 ">Total des transactions</p>

                                <h2 className="text-2xl font-bold p-3">{totalTransactions}</h2>

                                <span className="flex content-baseline gap-1">
                                    <Increase className="mt-2" />
                                    <p className="text-green-500 text-sm"> 8.5% </p>
                                    <p className="text-sm"> Up from yesterday</p>
                                </span>
                            </div>
                            <div className="text-3xl text-gray-500">
                                <i className="fas fa-user-friends"></i>
                            </div>
                            <div>
                                <Manymen className="flex items-center justify-between" />
                            </div>

                        </div>

                    </div>
                    <div className="flex items-center gap-16 mb-28 h-42 pr-20 xs:flex-col xs:p-0 xs:gap-4">
                        <div className="flex flex-col items-center bg-white text-blue-600 p-4 rounded-xl shadow-lg w-64 ml-32 xs:m-0">
                            <div className="">
                                <div className="flex justify-center mb-7 my-4">
                                    <Payement></Payement>
                                </div>
                                <div className="text-lg text-blue-600">Paiement par carte</div>
                            </div>
                        </div>

                        <div className="bg-white p-3 shadow-md rounded-xl flex items-center justify-between h-2/4 w-3/5 ml-6 xs:w-full xs:m-0">
                            <div>
                                <p className="text-sm text-gray-500">Nbre de transactions</p>
                                <h2 className="text-2xl font-bold p-3">{numTransactions}</h2>
                                <span className="flex content-baseline gap-1">
                                    <Increase className="mt-2" />
                                    <p className="text-green-500 text-sm"> 8.5% </p>
                                    <p className="text-sm"> Up from yesterday </p>
                                </span>
                            </div>
                            <div className="text-3xl text-gray-500">
                                <i className="fas fa-user-friends"></i>
                            </div>
                            <div >
                                <Manymen className="flex items-center justify-between" />
                            </div>
                        </div>

                    </div>
                    <div className="">
                        <table className="min-w-full xs:w-auto bg-white shadow-md rounded-md ">
                            <thead className="">
                                <tr className=" border-gray-300 text-primary ">
                                    <th className="p-4">Nom</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">RD</th>
                                    <th className="p-4">ND</th>
                                    <th className="p-4">RA</th>
                                    <th className="p-4">ND</th>
                                    <th className="p-4">Montant</th>
                                </tr>
                            </thead>
                            {/* {
	"0": {
		"id": 54,
		"user_id": 4,
		"": "+1.765.513.3548",
		"payin_wprovider_id": 7,
		"payin_status": "failed",
		"payout_phone_number": "+1.401.899.6588",
		"payout_wprovider_id": 8,
		"payout_status": "success",
		"amount": 44177.52,
		"amountWithoutFees": 42410.42,
		"type": "others",
		"token": "f90b80d4-bf79-349e-80d1-42659699d671",
		"disburse_token": "180fb6aa-9e9a-34b0-a905-251e208ccfd0",
		"otp_code": "206856",
		"deleted_at": null,
		"created_at": "2024-06-19T19:06:51.000000Z",
		"updated_at": "2024-06-19T19:06:51.000000Z"
	}
} */}
                            <tbody className="">
                                {transactions.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-300">
                                        <td className="p-4">{transaction.name}</td>
                                        <td className="p-4">{transaction.type}</td>
                                        <td className="p-4">{transaction.payin_phone_number}</td>
                                        <td className="p-4">{transaction.nd}</td>
                                        <td className="p-4">{transaction.ra}</td>
                                        <td className="p-4">{transaction.nd}</td>
                                        <td className="p-4 text-primary">
                                            {transaction.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Link href="/transactions/historique" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md mx-auto block w-fit">
                            Voir plus
                        </Link>
                    </div>
                </div>

            </Dashbord>
        </>
    )
}

export default Dashboard