"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// import Footer from './Footer';
import {
  Home,
  Download,
  SendHorizontal,
  Wifi,
  CreditCard,
  DollarSign,
  Settings,
  Users,
  Banknote,
} from "lucide-react";
import { sidebarLinks } from "@/constant";

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <Home size={18} />,
  "Online Deposit": <Download size={18} />,
  "Domestic Transfer": <SendHorizontal size={18} />,
  "Wire Transfer": <Wifi size={18} />,
  "Virtual Card": <CreditCard size={18} />,
  "Loan & Mortgages": <Banknote size={18} />,
  Transactions: <CreditCard size={18} />,
  Withdrawal: <DollarSign size={18} />,
  "Account Manager": <Users size={18} />,
  Settings: <Settings size={18} />,
};

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-white shadow-md px-4 py-6 flex flex-col justify-between  max-md:hidden">
      <div>
        {/* Logo */}
        {/* <Link href='/dashboard' className='flex justify-center mb-6'>
          <Image 
            src='/assets/images/osbicanada.png'
            alt='SBILogo'
            width={100}
            height={100}
            className="rounded-full"
          />
        </Link> */}

        {/* User Info */}
        <div className="flex flex-col items-center gap-1 mb-10">
          <div className="size-20 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/images/profile.jpg"
              alt="User Avatar"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-sm font-semibold">Princess Evenly</p>
          <span className="text-xs text-gray-400">Savings</span>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((item) => {
            const isActive =
              pathname === item.route || pathname.startsWith(`${item.route}/`);

            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  isActive
                    ? "bg-[#304FFE] text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                {iconMap[item.label]}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
