"use client"
import Dashbord from "../Components/Dashbord"
import { useRouter } from "next/navigation"
import Image from "next/image"
import dashm from '@/public/assets/images/dashm.png'
import dashmSt from '@/public/assets/images/dashmSt.png'
import dashc from '@/public/assets/images/dashc.png'
import dashcSt from '@/public/assets/images/dashcSt.png'
import dashList from '@/public/assets/images/dashListe.png'
import { useSession } from "next-auth/react"
import { headers } from "next/headers"
import { url } from "inspector"
import { Mobile, Payement, Manymen, Increase } from "../Components/icons"

import Select from "../Components/Select"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    //################################## CONSTANTES #############################//
    const apiUrl = process.env.NEXT_PUBLIC_APIURL
    const router = useRouter()
    const { data: session } = useSession()
    const auth = { headers: { Authorization: `Bearer ${session?.user.token}` } }
    //################################## VARIABLES ##############################//

    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [numTransactions, setNumTransactions] = useState(0);

    const [transactionCount, setTransactionCount] = useState(0);

    useEffect(() => {
        // Remplacez cette URL par l'endpoint réel de votre API
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('https://api.exemple.com/transactions');
                setTransactions(response.data.transactions);
                setTotalTransactions(response.data.totalTransactions);
                setNumTransactions(response.data.numTransactions);
            } catch (error) {
                console.error('Erreur de récupération des données:', error);
            }
        };

        fetchTransactions();

    }, []);


    useEffect(() => {
        // Fetch data from the JSON file in the public folder
        fetch('/transactions.json')
            .then(response => response.json())
            .then(data => {
                setTransactions(data.transactions);
                setTotalTransactions(data.totalTransactions);
                setTransactionCount(data.transactionCount);
            })
            .catch(error => console.error('Error fetching data:', error));
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
                    <div className="flex items-center gap-16 mb-28 h-42 pr-20">
                        <div className="bg-blue-500 text-white text-center p-4 rounded-xl shadow-lg w-64 ml-32 ">
                            <div className="">
                                <div className="flex justify-center mb-7 my-4 ">
                                    <Mobile></Mobile>
                                </div>
                                <span className="text-lg font-medium">Paiement mobile</span>
                            </div>
                        </div>

                        <div className="bg-white p-3 shadow-md rounded-xl flex items-center justify-between h-2/4 w-3/5 ml-6">
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
                    <div className="flex items-center gap-16 mb-28 h-42 pr-20">
                        <div className="flex flex-col items-center bg-white text-blue-600 p-4 rounded-xl shadow-lg w-64 ml-32">
                            <div className="">
                                <div className="flex justify-center mb-7 my-4">
                                    <Payement></Payement>
                                </div>
                                <div className="text-lg text-blue-600">Paiement par carte</div>
                            </div>
                        </div>

                        <div className="bg-white p-3 shadow-md rounded-xl flex items-center justify-between h-2/4 w-3/5 ml-6">
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
                    <div className="bg-white p-4 shadow-md rounded-md">
                        <table className="min-w-full border-collapse block md:table">
                            <thead className="block md:table-header-group">
                                <tr className=" border-gray-300 block md:table-row text-blue-600 ">
                                    <th className="block md:table-cell p-2">Nom</th>
                                    <th className="block md:table-cell p-2">Transaction ID</th>
                                    <th className="block md:table-cell p-2">Type</th>
                                    <th className="block md:table-cell p-2">RD</th>
                                    <th className="block md:table-cell p-2">ND</th>
                                    <th className="block md:table-cell p-2">RA</th>
                                    <th className="block md:table-cell p-2">ND</th>
                                    <th className="block md:table-cell p-2">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group">
                                {transactions.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-300 block md:table-row">
                                        <td className="block md:table-cell p-2">{transaction.name}</td>
                                        <td className="block md:table-cell p-2">{transaction.transactionId}</td>
                                        <td className="block md:table-cell p-2">{transaction.type}</td>
                                        <td className="block md:table-cell p-2">{transaction.rd}</td>
                                        <td className="block md:table-cell p-2">{transaction.nd}</td>
                                        <td className="block md:table-cell p-2">{transaction.ra}</td>
                                        <td className="block md:table-cell p-2">{transaction.nd}</td>
                                        <td className="block md:table-cell p-2 text-blue-500">
                                            {transaction.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                            Voir plus
                        </button>
                    </div>
                </div>

            </Dashbord>
        </>
    )
}

export default Dashboard