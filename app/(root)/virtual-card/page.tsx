'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronDown, CreditCard, Eye, EyeOff, Plus, Settings, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import DynamicDate from '@/components/DynamicDate';
import VirtualCreditCard from '@/components/VirtualCreditCard';

// Sample data for the accounts
const accountsData = [
  {
    id: '1',
    name: 'Primary Checking',
    balance: 7297596,
    accountNumber: '**** **** 4567',
    transactions: [
      { id: 1, date: 'Mar 10', description: 'Grocery Store', amount: -78.65, category: 'Shopping' },
      { id: 2, date: 'Mar 08', description: 'Salary Deposit', amount: 3200.00, category: 'Income' },
      { id: 3, date: 'Mar 01', description: 'Rent Payment', amount: -8500.00, category: 'Housing' },
    ]
  },
  {
    id: '2',
    name: 'Savings Account',
    balance: 1670404,
    accountNumber: '**** **** 7890',
    transactions: [
      { id: 1, date: 'Mar 01', description: 'Transfer from Checking', amount: 1019500.00, category: 'Transfer' },
      { id: 2, date: 'Feb 15', description: 'Interest Payment', amount: 212.88, category: 'Income' },
    ]
  }
];

// Sample data for cards
const cardsData = [
  {
    id: '1',
    name: 'Platinum Rewards',
    type: 'Visa',
    number: '**** **** **** 1234',
    expiryDate: '05/28',
    availableCredit: 8500,
    creditLimit: 10000,
    cardColor: 'bg-gradient-to-r from-blue-700 to-blue-900',
    transactions: [
      { id: 1, date: 'Mar 11', description: 'Restaurant', amount: 84.20, category: 'Dining' },
      { id: 2, date: 'Mar 09', description: 'Online Shopping', amount: 129.99, category: 'Shopping' },
      { id: 3, date: 'Mar 05', description: 'Gas Station', amount: 45.75, category: 'Transportation' },
    ]
  },
  {
    id: '2',
    name: 'Cash Back Mastercard',
    type: 'Mastercard',
    number: '**** **** **** 5678',
    expiryDate: '12/26',
    availableCredit: 2800,
    creditLimit: 5000,
    cardColor: 'bg-gradient-to-r from-purple-700 to-purple-900',
    transactions: [
      { id: 1, date: 'Mar 08', description: 'Grocery Store', amount: 152.37, category: 'Shopping' },
      { id: 2, date: 'Mar 03', description: 'Streaming Service', amount: 14.99, category: 'Entertainment' },
    ]
  }
];

const VirtualCard = () => {
  const [selectedAccount, setSelectedAccount] = useState(accountsData[0]);
  const [selectedCard, setSelectedCard] = useState(cardsData[0]);
  const [hideBalances, setHideBalances] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleFreezeAlert = () => {
    alert("Temporal Hold On Account By CRA Due To Unpaid Taxes Withheld.");
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 mt-20 md:mt-0">
      
      <div className="max-w-6xl mx-auto"> {/* Increased max-width */}
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Virtual Cards</h1>
            <DynamicDate />
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleFreezeAlert}>
              <Shield className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleFreezeAlert}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between mb-6">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-16 w-24 space-y-1 cursor-pointer"
            onClick={() => setHideBalances(!hideBalances)}
          >
            {hideBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            <span className="text-xs">{hideBalances ? 'Show' : 'Hide'}</span>
          </Button>

          <Link href='/transfer' className='cursor-pointer'>
            <Button className="flex flex-col items-center justify-center h-16 w-24 space-y-1 cursor-pointer">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Transfer</span>
            </Button>
          </Link>
        </div>

        {/* Main Tabs: Accounts and Cards */}
        <Tabs defaultValue="accounts" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          {/* Accounts Tab Content */}
          <TabsContent value="accounts" className="space-y-4">
            {/* Account Selection */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">My Accounts</h2>
                <p className="text-sm text-slate-500">{accountsData.length} accounts</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center">
                <span>All Accounts</span>
              </Button>
            </div>

            {/* Account Cards Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
              {accountsData.map(account => (
                <Card
                  key={account.id}
                  className={`cursor-pointer ${selectedAccount.id === account.id ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => setSelectedAccount(account)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription>{account.accountNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-500">Available Balance</p>
                        <p className="text-2xl font-bold">
                          {hideBalances ? '••••••' : formatCurrency(account.balance)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleFreezeAlert}>Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Account Button */}
            <Button variant="outline" className="w-full flex items-center justify-center py-6" onClick={handleFreezeAlert}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add New Account</span>
            </Button>

            {/* Selected Account Details */}
            {selectedAccount && (
              <>
                <h2 className="text-lg font-semibold mt-6 mb-3">Recent Transactions</h2>
                <Card>
                  <CardContent className="pt-6">
                    {selectedAccount.transactions.map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-slate-500">{transaction.date} • {transaction.category}</p>
                        </div>
                        <p className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>

                    <Button variant="ghost" className="w-full">
                      <Link href='transactions-history'>
                        See All Transactions
                      </Link>

                    </Button>

                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Cards Tab Content */}
          <TabsContent value="cards" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">My Cards</h2>
                <p className="text-sm text-slate-500">{cardsData.length} active cards</p>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center" onClick={handleFreezeAlert}>
                <span>Manage</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Credit Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">


              {/* {cardsData.map(card => (
                <div
                  key={card.id}
                  className={`rounded-lg overflow-hidden cursor-pointer ${selectedCard.id === card.id ? 'ring-2 ring-blue-600' : ''}`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className={`${card.cardColor} p-4 text-white`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">{card.name}</p>
                        <p className="text-lg font-medium mt-3">{card.number}</p>
                      </div>
                      <CreditCard className="h-6 w-6 opacity-80" />
                    </div>
                    <div className="flex justify-between mt-8 text-sm">
                      <div>
                        <p className="opacity-80">Expires</p>
                        <p>{card.expiryDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="opacity-80">Card Type</p>
                        <p>{card.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 border border-t-0 border-slate-200 rounded-b-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Available Credit</p>
                        <p className="text-lg font-semibold">
                          {hideBalances ? '••••••' : formatCurrency(card.availableCredit)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Credit Limit</p>
                        <p className="text-lg font-semibold">
                          {hideBalances ? '••••••' : formatCurrency(card.creditLimit)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))} */}

              {/* <div
                className="relative w-[320px] sm:w-[500px] h-[190px] sm:h-[300px] perspective cursor-pointer"
  
              >
                <div
                  className=
                    'relative w-full h-full transition-transform duration-1000'
                >
                  
                  <div className="absolute w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#0045c7] to-[#ff2c7d] px-4 sm:px-6 py-4 sm:py-6 backface-hidden z-10">
 
                    <div className="relative z-10 flex justify-between items-center mb-6">
                      <Image
                        src="/images/chip.png"
                        alt="Chip"
                        width={50}
                        height={50}
                      />
                      <Image
                        src="/images/visa.png"
                        alt="Visa"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="relative z-10 text-white text-lg sm:text-2xl tracking-widest flex justify-between mb-4">
                      <p>****</p>
                      <p>****</p>
                      <p>****</p>
                      <p>6420</p>
                    </div>
                    <div className="relative z-10 text-xs sm:text-sm text-white flex justify-between mb-1">
                      <p>CARD HOLDER</p>
                      <p>VALID TILL</p>
                    </div>
                    <div className="relative z-10 text-white text-sm sm:text-lg flex justify-between">
                      <p>JOE ALISON</p>
                      <p>10 / 25</p>
                    </div>
                  </div>
        
                </div>
              </div> */}

<VirtualCreditCard
  cardType="visa"
  cardHolder="JOE ALISON"
  lastFour="6420"
  expiry="10/25"
  limit={5000}
  available={3000}
  bgGradient="bg-gradient-to-br from-purple-600 to-indigo-500"
/>

<VirtualCreditCard
  cardType="mastercard"
  cardHolder="JOHN DOE"
  lastFour="1122"
  expiry="09/27"
  limit={7000}
  available={2500}
  bgGradient="bg-gradient-to-br from-yellow-500 to-red-500"
/>


            </div>

            {/* Virtual Card Button */}
            <Button variant="outline" className="w-full flex items-center justify-center py-6" onClick={handleFreezeAlert}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Virtual Card</span>
            </Button>

            {/* Selected Card Transactions */}
            {selectedCard && (
              <>
                <h2 className="text-lg font-semibold mt-6 mb-3">Recent Card Transactions</h2>
                <Card>
                  <CardContent className="pt-6">
                    {selectedCard.transactions.map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-slate-500">{transaction.date} • {transaction.category}</p>
                        </div>
                        <p className="font-medium text-red-600">
                          -{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">See All Transactions</Button>
                  </CardFooter>
                </Card>

                {/* Card Settings */}
                <h2 className="text-lg font-semibold mt-6 mb-3">Card Settings</h2>
                <Card>
                  <CardContent className="py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 mr-3 text-slate-500" />
                          <span>Contactless Payments</span>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Enabled</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-3 text-slate-500" />
                          <span>International Transactions</span>
                        </div>
                        <div className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Disabled</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-3 text-slate-500" />
                          <span>Online Purchases</span>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Enabled</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" onClick={handleFreezeAlert}>Manage Card Settings</Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
};

export default VirtualCard;