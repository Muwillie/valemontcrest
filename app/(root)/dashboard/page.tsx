"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCreditCard, faArrowUp, faArrowDown, faBell, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Image from 'next/image'

config.autoAddCss = false

type CardType = 'visa' | 'mastercard'

interface VirtualCardProps {
  cardType?: CardType
  cardHolder?: string
  lastFour?: string
  expiry?: string
  limit?: number
  available?: number
  bgGradient?: string
}

function Dashboard(props: VirtualCardProps) {
  // Sample data for recent transactions
  const recentTransactions = [
    { id: 1, name: 'Grocery Store', amount: -85.20, date: 'Today', icon: '🛒' },
    { id: 2, name: 'Salary Deposit', amount: 2750.00, date: 'Yesterday', icon: '💼' },
    { id: 3, name: 'Electric Bill', amount: -124.50, date: 'Apr 18', icon: '⚡' },
    { id: 4, name: 'Netflix Subscription', amount: -15.99, date: 'Apr 15', icon: '📺' },
  ]

  // Sample data for expense categories
  const expenseCategories = [
    { name: 'Food', amount: 450, color: 'bg-orange-500', bgColor: 'bg-orange-100' },
    { name: 'Internet', amount: 80, color: 'bg-indigo-500', bgColor: 'bg-indigo-100' },
    { name: 'Gas', amount: 120, color: 'bg-rose-500', bgColor: 'bg-rose-100' },
    { name: 'Gym', amount: 50, color: 'bg-cyan-500', bgColor: 'bg-cyan-100' },
    { name: 'Entertainment', amount: 200, color: 'bg-purple-500', bgColor: 'bg-purple-100' },
    { name: 'Healthcare', amount: 150, color: 'bg-pink-500', bgColor: 'bg-pink-100' },
  ]

  // Accounts summary
  const accounts = {
    checking: 5845.20,
    savings: 12350.75,
    investments: 32640.50
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16 lg:py-0">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-gray-500">Welcome back, Johnson</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white rounded-full shadow-sm relative">
              <FontAwesomeIcon icon={faBell} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Balance Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Account Balance</h2>
                <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-80">Checking</p>
                  <p className="text-2xl font-bold">${accounts.checking.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-xs">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    <span>4.2% from last month</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-80">Savings</p>
                  <p className="text-2xl font-bold">${accounts.savings.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-xs">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    <span>1.8% from last month</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <p className="text-sm opacity-80">Investments</p>
                  <p className="text-2xl font-bold">${accounts.investments.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-xs">
                    <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                    <span>7.5% from last month</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cards Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Your Cards</h2>
                <button className="flex items-center gap-2 text-blue-500 font-medium">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Card</span>
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 overflow-x-auto pb-2">
                {/* Visa Card */}
                <div className="min-w-[280px] w-full sm:w-80 h-48">
                  <div className="relative w-full h-full">
                    <div className="absolute w-full h-full rounded-xl overflow-hidden px-6 py-6 z-10 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                      <div className="relative z-10 flex justify-between items-center mb-8">
                        <Image
                          src="/images/chip.png"
                          alt="Chip"
                          width={40}
                          height={40}
                        />
                        <Image
                          src="/images/visa.png"
                          alt="Visa"
                          width={60}
                          height={40}
                        />
                      </div>

                      <div className="relative z-10 text-white text-lg tracking-widest flex justify-between mb-8">
                        <p>****</p>
                        <p>****</p>
                        <p>****</p>
                        <p>1412</p>
                      </div>

                      <div className="flex justify-between text-sm text-white">
                        <div>
                          <p className="opacity-70 mb-1">CARD HOLDER</p>
                          <p>Johnson</p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-70 mb-1">VALID TILL</p>
                          <p>24/12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mastercard */}
                <div className="min-w-[280px] w-full sm:w-80 h-48">
                  <div className="relative w-full h-full">
                    <div className="absolute w-full h-full rounded-xl overflow-hidden px-6 py-6 z-10 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg">
                      <div className="relative z-10 flex justify-between items-center mb-8">
                        <Image
                          src="/images/chip.png"
                          alt="Chip"
                          width={40}
                          height={40}
                        />
                        <Image
                          src="/images/mastercard.png"
                          alt="Mastercard"
                          width={60}
                          height={40}
                        />
                      </div>

                      <div className="relative z-10 text-white text-lg tracking-widest flex justify-between mb-6">
                        <p>****</p>
                        <p>****</p>
                        <p>****</p>
                        <p>5678</p>
                      </div>

                      <div className="flex justify-between text-sm text-white">
                        <div>
                          <p className="opacity-70 mb-1">CARD HOLDER</p>
                          <p>Johnson</p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-70 mb-1">VALID TILL</p>
                          <p>25/11</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expense Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Monthly Expenses</h2>
                <button className="text-blue-500">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {expenseCategories.map((category, index) => (
                  <div key={index} className={`${category.bgColor} rounded-lg p-4 flex items-center gap-3`}>
                    <div className={`flex-shrink-0 w-10 h-10 ${category.color} rounded-full flex items-center justify-center text-white`}>
                      <span className="text-lg">{category.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-700 font-medium truncate">{category.name}</p>
                      <p className="text-gray-900 font-bold">${category.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-50 p-4 rounded-lg flex flex-col items-center transition-all hover:bg-blue-100">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                    <FontAwesomeIcon icon={faArrowUp} />
                  </div>
                  <span className="text-gray-700 font-medium">Send</span>
                </button>
                <button className="bg-green-50 p-4 rounded-lg flex flex-col items-center transition-all hover:bg-green-100">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                  <span className="text-gray-700 font-medium">Receive</span>
                </button>
                <button className="bg-purple-50 p-4 rounded-lg flex flex-col items-center transition-all hover:bg-purple-100">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mb-2">
                    <FontAwesomeIcon icon={faCreditCard} />
                  </div>
                  <span className="text-gray-700 font-medium">Pay Bills</span>
                </button>
                <button className="bg-amber-50 p-4 rounded-lg flex flex-col items-center transition-all hover:bg-amber-100">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white mb-2">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <span className="text-gray-700 font-medium">Invest</span>
                </button>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
                <button className="text-sm text-blue-500 font-medium">See All</button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        <span>{transaction.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.name}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                View All Transactions
              </button>
            </div>
            
            {/* Savings Goals */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Savings Goals</h2>
                <button className="text-blue-500">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">Vacation Fund</span>
                    <span className="text-gray-700">$1,200 / $3,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-2/5"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">New Car</span>
                    <span className="text-gray-700">$5,400 / $25,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-1/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard