'use client'


// import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false;

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

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { sidebarLinks } from "@/constant"

const MobileNav = ({ user }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // const handleLogout = async () => {

  //   // Clear client-side cache and session
  //   await signOut({
  //     redirect: false, // We'll handle redirect manually
  //     callbackUrl: "/sign-in"
  //   });
  //   setIsOpen(false);
  //   // Force a full page reload to clear all NextAuth session data
  //   window.location.href = "/sign-in";
  // };

  // const handleFreezeAlert = () => {
  //   setIsOpen(false);
  //   alert("🚨 Your bank account has been frozen! Contact support immediately.");
  // };

  return (
    <section className="w-fulll max-w-[264px]">
      <Sheet>
        <SheetTrigger>

          <FontAwesomeIcon icon={faBars} onClick={() => setIsOpen(!isOpen)} className="text-2xl font-extrabold text-white" />

        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">

          <SheetTitle>
            {/* User Info */}
            <div className="flex flex-col items-center gap-1 mt-5 mb-10">


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

          </SheetTitle>



          <div className="flex flex-col justify-between items-center overflow-y-auto;">
            <SheetClose>
              {/* Sidebar Links */}
              <nav className='flex flex-col gap-1'>
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose key={item.route}>
                    <Link
                      href={item.route}
                      key={item.label}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                        isActive ? 'bg-[#304FFE] text-white' : 'text-gray-600 hover:bg-gray-100'
                      )}
                      onClick={handleLinkClick}
                    >
                      {iconMap[item.label]}
                      <span>{item.label}</span>
                    </Link>
                    </SheetClose>
                  );
                })}
              </nav>




            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav