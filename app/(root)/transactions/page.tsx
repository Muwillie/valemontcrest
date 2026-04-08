"use client"

import { useState } from "react";
import {
  ShoppingCart, Banknote, Wallet, CreditCard, PiggyBank, Plane,
  Home, Utensils, Bus, Heart, Gamepad2, Gift, Dumbbell, Car,
  GraduationCap, Phone, Film, Music2, Leaf, Building2,
  UtensilsCrossed, ShoppingBasket, Tv, TrendingUp, Shield,
  Receipt, Wrench, Shirt, Sofa, BookOpen, Baby, Zap, PawPrint,
  Sparkles,
} from "lucide-react";

export const categoryIcons: Record<string, React.ReactNode> = {
  "Shopping": <ShoppingCart className="w-5 h-5 text-muted-foreground" />,
  "Salary": <Banknote className="w-5 h-5 text-muted-foreground" />,
  "Transfer": <Wallet className="w-5 h-5 text-muted-foreground" />,
  "Credit Card": <CreditCard className="w-5 h-5 text-muted-foreground" />,
  "Savings": <PiggyBank className="w-5 h-5 text-muted-foreground" />,
  "Travel": <Plane className="w-5 h-5 text-muted-foreground" />,
  "Rent": <Home className="w-5 h-5 text-muted-foreground" />,
  "Food": <Utensils className="w-5 h-5 text-muted-foreground" />,
  "Transport": <Bus className="w-5 h-5 text-muted-foreground" />,
  "Health": <Heart className="w-5 h-5 text-muted-foreground" />,
  "Entertainment": <Gamepad2 className="w-5 h-5 text-muted-foreground" />,
  "Gifts": <Gift className="w-5 h-5 text-muted-foreground" />,
  "Fitness": <Dumbbell className="w-5 h-5 text-muted-foreground" />,
  "Car": <Car className="w-5 h-5 text-muted-foreground" />,
  "Education": <GraduationCap className="w-5 h-5 text-muted-foreground" />,
  "Phone": <Phone className="w-5 h-5 text-muted-foreground" />,
  "Movies": <Film className="w-5 h-5 text-muted-foreground" />,
  "Music": <Music2 className="w-5 h-5 text-muted-foreground" />,
  "Eco": <Leaf className="w-5 h-5 text-muted-foreground" />,
  "Bills": <Building2 className="w-5 h-5 text-muted-foreground" />,
  "Dining": <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />,
  "Groceries": <ShoppingBasket className="w-5 h-5 text-muted-foreground" />,
  "Subscriptions": <Tv className="w-5 h-5 text-muted-foreground" />,
  "Donation": <Heart className="w-5 h-5 text-muted-foreground" />,
  "Food Delivery": <Utensils className="w-5 h-5 text-muted-foreground" />,
  "Gym": <Dumbbell className="w-5 h-5 text-muted-foreground" />,
  "Freelance": <Banknote className="w-5 h-5 text-muted-foreground" />,
  "Investment": <TrendingUp className="w-5 h-5 text-muted-foreground" />,
  "Insurance": <Shield className="w-5 h-5 text-muted-foreground" />,
  "Loan": <CreditCard className="w-5 h-5 text-muted-foreground" />,
  "Phone Bill": <Phone className="w-5 h-5 text-muted-foreground" />,
  "Tax": <Receipt className="w-5 h-5 text-muted-foreground" />,
  "Repair": <Wrench className="w-5 h-5 text-muted-foreground" />,
  "Laundry": <Shirt className="w-5 h-5 text-muted-foreground" />,
  "Furniture": <Sofa className="w-5 h-5 text-muted-foreground" />,
  "Books": <BookOpen className="w-5 h-5 text-muted-foreground" />,
  "Baby Products": <Baby className="w-5 h-5 text-muted-foreground" />,
  "Electronics": <Zap className="w-5 h-5 text-muted-foreground" />,
  "Pet Care": <PawPrint className="w-5 h-5 text-muted-foreground" />,
  "Beauty": <Sparkles className="w-5 h-5 text-muted-foreground" />,
};

function CardBadge({ cardType, cardDigits }: { cardType: string; cardDigits: string }) {
  const isVisa = cardType.toLowerCase() === "visa";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded ${
          isVisa ? "bg-blue-700 text-white" : "bg-orange-500 text-white"
        }`}
      >
        {isVisa ? "VISA" : "MC"}
      </span>
      <span className="text-sm text-gray-500">{cardDigits}</span>
    </div>
  );
}

const transactionsData = [
  {
    id: 1,
    category: "Music",
    date: "2024-03-20",
    amount: "$15.00",
    cardType: "Visa",
    cardDigits: "*1234",
    description: "Spotify Subscription",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 2,
    category: "Shopping",
    date: "2024-03-19",
    amount: "$120.00",
    cardType: "Mastercard",
    cardDigits: "*5678",
    description: "Zara Purchase",
    status: "Pending",
    party: "Receiver",
  },
  {
    id: 4,
    category: "Groceries",
    date: "2024-03-17",
    amount: "$45.50",
    cardType: "Mastercard",
    cardDigits: "*2345",
    description: "Walmart",
    status: "Completed",
    party: "Receiver",
  },
  {
    id: 5,
    category: "Bills",
    date: "2024-03-16",
    amount: "$95.25",
    cardType: "Visa",
    cardDigits: "*3456",
    description: "Electricity Bill",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 6,
    category: "Transport",
    date: "2024-03-15",
    amount: "$23.00",
    cardType: "Mastercard",
    cardDigits: "*4567",
    description: "Uber Ride",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 7,
    category: "Dining",
    date: "2024-03-14",
    amount: "$85.00",
    cardType: "Visa",
    cardDigits: "*6789",
    description: "Restaurant Bill",
    status: "Pending",
    party: "Receiver",
  },
  {
    id: 8,
    category: "Health",
    date: "2024-03-13",
    amount: "$200.00",
    cardType: "Mastercard",
    cardDigits: "*7891",
    description: "Medical Checkup",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 9,
    category: "Subscriptions",
    date: "2024-03-12",
    amount: "$12.99",
    cardType: "Mastercard",
    cardDigits: "*8901",
    description: "Netflix",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 10,
    category: "Donation",
    date: "2024-03-11",
    amount: "$30.00",
    cardType: "Visa",
    cardDigits: "*9012",
    description: "Charity",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 11,
    category: "Entertainment",
    date: "2024-03-10",
    amount: "$40.00",
    cardType: "Mastercard",
    cardDigits: "*0123",
    description: "Movie Tickets",
    status: "Pending",
    party: "Receiver",
  },
  {
    id: 12,
    category: "Travel",
    date: "2024-03-09",
    amount: "$350.00",
    cardType: "Mastercard",
    cardDigits: "*6781",
    description: "Flight Booking",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 13,
    category: "Food Delivery",
    date: "2024-03-08",
    amount: "$22.30",
    cardType: "Visa",
    cardDigits: "*8888",
    description: "Uber Eats",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 14,
    category: "Gym",
    date: "2024-03-07",
    amount: "$50.00",
    cardType: "Mastercard",
    cardDigits: "*1212",
    description: "Monthly Membership",
    status: "Failed",
    party: "Sender",
  },
  {
    id: 15,
    category: "Freelance",
    date: "2024-03-06",
    amount: "$500.00",
    cardType: "Visa",
    cardDigits: "*2222",
    description: "Upwork Payment",
    status: "Completed",
    party: "Receiver",
  },
  {
    id: 16,
    category: "Investment",
    date: "2024-03-05",
    amount: "$1000.00",
    cardType: "Mastercard",
    cardDigits: "*3434",
    description: "Stock Purchase",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 17,
    category: "Insurance",
    date: "2024-03-04",
    amount: "$89.00",
    cardType: "Mastercard",
    cardDigits: "*5656",
    description: "Car Insurance",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 18,
    category: "Savings",
    date: "2024-03-03",
    amount: "$150.00",
    cardType: "Visa",
    cardDigits: "*6767",
    description: "Monthly Savings",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 19,
    category: "Rent",
    date: "2024-03-02",
    amount: "$850.00",
    cardType: "Mastercard",
    cardDigits: "*9898",
    description: "Monthly Rent",
    status: "Pending",
    party: "Receiver",
  },
  {
    id: 20,
    category: "Loan",
    date: "2024-03-01",
    amount: "$250.00",
    cardType: "Mastercard",
    cardDigits: "*7878",
    description: "Loan Repayment",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 21,
    category: "Phone Bill",
    date: "2024-02-29",
    amount: "$45.00",
    cardType: "Visa",
    cardDigits: "*4343",
    description: "Monthly Airtime",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 22,
    category: "Tax",
    date: "2024-02-28",
    amount: "$300.00",
    cardType: "Mastercard",
    cardDigits: "*3434",
    description: "Quarterly Tax",
    status: "Failed",
    party: "Sender",
  },
  {
    id: 23,
    category: "Repair",
    date: "2024-02-27",
    amount: "$100.00",
    cardType: "Mastercard",
    cardDigits: "*5454",
    description: "Phone Repair",
    status: "Completed",
    party: "Receiver",
  },
  {
    id: 24,
    category: "Laundry",
    date: "2024-02-26",
    amount: "$35.00",
    cardType: "Visa",
    cardDigits: "*1212",
    description: "Dry Cleaning",
    status: "Pending",
    party: "Sender",
  },
  {
    id: 25,
    category: "Furniture",
    date: "2024-02-25",
    amount: "$420.00",
    cardType: "Mastercard",
    cardDigits: "*9898",
    description: "Table & Chair",
    status: "Completed",
    party: "Receiver",
  },
  {
    id: 26,
    category: "Books",
    date: "2024-02-24",
    amount: "$18.99",
    cardType: "Mastercard",
    cardDigits: "*4444",
    description: "Amazon Books",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 27,
    category: "Baby Products",
    date: "2024-02-23",
    amount: "$60.00",
    cardType: "Visa",
    cardDigits: "*2222",
    description: "Diapers & Wipes",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 28,
    category: "Electronics",
    date: "2024-02-22",
    amount: "$850.00",
    cardType: "Mastercard",
    cardDigits: "*7777",
    description: "Smartphone Purchase",
    status: "Failed",
    party: "Receiver",
  },
  {
    id: 29,
    category: "Pet Care",
    date: "2024-02-21",
    amount: "$65.00",
    cardType: "Visa",
    cardDigits: "*1313",
    description: "Vet Visit",
    status: "Completed",
    party: "Sender",
  },
  {
    id: 30,
    category: "Beauty",
    date: "2024-02-20",
    amount: "$75.00",
    cardType: "Mastercard",
    cardDigits: "*1010",
    description: "Salon Service",
    status: "Completed",
    party: "Receiver",
  },
];

const ITEMS_PER_PAGE = 10;

export default function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = transactionsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(transactionsData.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-0 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Transactions</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Card</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {currentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {categoryIcons[tx.category] ?? <Wallet className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-medium">{tx.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{tx.date}</td>
                  <td className="px-4 py-3">{tx.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold text-white ${
                        tx.status === "Completed"
                          ? "bg-green-500"
                          : tx.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tx.party}</td>
                  <td className="px-4 py-3">
                    <CardBadge cardType={tx.cardType} cardDigits={tx.cardDigits} />
                  </td>
                  <td className="px-4 py-3 font-bold">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 text-sm rounded-md border border-gray-300 shadow-sm hover:bg-blue-100 transition ${
                page === currentPage ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}