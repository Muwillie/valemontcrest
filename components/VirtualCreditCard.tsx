import Image from 'next/image'
import clsx from 'clsx'

type CardType = 'visa' | 'mastercard'

interface VirtualCardProps {
  cardType: CardType
  cardHolder: string
  lastFour: string
  expiry: string
  limit: number
  available: number
  bgGradient?: string 
}

export default function VirtualCreditCard({
  cardType,
  cardHolder,
  lastFour,
  expiry,
//   limit,
//   available,
  bgGradient,
}: VirtualCardProps) {
 

  const logo =
    cardType === 'visa'
      ? '/images/visa.png'
      : '/images/mastercard.png'

  return (

      <div
        className="relative w-75 sm:w-125 h-47.5 sm:h-75 perspective cursor-pointer"
        
      >
        <div
          className=
            'relative w-full h-full transition-transform duration-1000'>
          {/* FRONT */}
          <div  className={clsx(
    'absolute w-full h-full rounded-xl overflow-hidden px-4 sm:px-6 py-4 sm:py-6 backface-hidden z-10',
    bgGradient || 'bg-linear-to-tr from-[#0045c7] to-[#ff2c7d]'
  )}>

            <div className="relative z-10 flex justify-between items-center mb-6">
              <Image
                src="/images/chip.png"
                alt="Chip"
                width={50}
                height={50}
              />
              <Image
                src={logo}
                alt={cardType.toUpperCase()}
                width={60}
                height={60}
              />
            </div>

            {/* Card Number */}
            <div className="relative z-10 text-white text-lg sm:text-2xl tracking-widest flex justify-between mb-6">
              <p>****</p>
              <p>****</p>
              <p>****</p>
              <p>{lastFour}</p>
            </div>

            {/* Balance Info */}
            {/* <div className="relative z-10 flex justify-between text-xs sm:text-sm text-white mb-2">
              <div>
                <p className="opacity-70">Card Limit</p>
                <p>${limit.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="opacity-70">Available</p>
                <p>${available.toLocaleString()}</p>
              </div>
            </div> */}

            {/* Cardholder + Expiry */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between text-xs sm:text-sm text-white">
              <div>
                <p className="opacity-70 mb-1">CARD HOLDER</p>
                <p>{cardHolder}</p>
              </div>
              <div className="text-right">
                <p className="opacity-70 mb-1">VALID TILL</p>
                <p>{expiry}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

  )
}