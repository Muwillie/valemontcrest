// src/components/WithdrawalPage.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { CreditCard, HelpCircle, ArrowRightCircle, BanknoteIcon } from 'lucide-react';

export default function WithdrawalPage() {
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  

  const accounts = [
    { id: 'savings', name: 'Savings Account', balance: 12450.75 },
    { id: 'checking', name: 'Checking Account', balance: 5680.32 },
    { id: 'investment', name: 'Investment Account', balance: 34200.18 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    setIsConfirmDialogOpen(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('');
        setAccountType('');
        setWithdrawalMethod('');
      }, 3000);
    }, 2000);
  };

  const selectedAccount = accounts.find(acc => acc.id === accountType);

  return (
    <div className="p-4 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl m-auto"
      >
        <Card className="w-full max-w-5xl lg:w-2/3 mx-auto py-0">
          <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BanknoteIcon className="h-6 w-6" />
              Withdraw Funds
            </CardTitle>
            <CardDescription className="text-blue-100">
              Securely withdraw money from your accounts
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Withdrawal Successful</h3>
                <p className="text-gray-600">
                  Your withdrawal request for ${amount} has been processed successfully.
                </p>
              </motion.div>
            ) : isProcessing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-12 h-12 mb-4"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Your Withdrawal</h3>
                <p className="text-gray-600">Please wait while we process your request...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="account-type" className="font-medium">
                      Select Account
                    </Label>
                    <Select 
                      required
                      value={accountType} 
                      onValueChange={setAccountType}
                    >
                      <SelectTrigger id="account-type" className="w-full">
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - $ {account.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-medium">
                      Withdrawal Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1.5 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                        max={selectedAccount?.balance || 999999}
                        step="0.01"
                      />
                    </div>
                    {selectedAccount && (
                      <p className="text-sm text-gray-500">
                        Available balance: ${selectedAccount.balance.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-method" className="font-medium">
                      Withdrawal Method
                    </Label>
                    <Select 
                      required
                      value={withdrawalMethod} 
                      onValueChange={setWithdrawalMethod}
                    >
                      <SelectTrigger id="withdrawal-method" className="w-full">
                        <SelectValue placeholder="Select withdrawal method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atm">ATM Withdrawal</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {withdrawalMethod === 'atm' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-blue-50 rounded-md"
                    >
                      <p className="text-sm text-blue-800">
                        ATM withdrawal will be available at any of our partner ATMs within 30 minutes.
                        You&apos;ll receive a temporary PIN code via SMS.
                      </p>
                    </motion.div>
                  )}
                </div>
              </form>
            )}
          </CardContent>
          
          {!isProcessing && !isSuccess && (
            <CardFooter className="flex justify-between border-t p-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" type="button">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Need assistance with your withdrawal? Contact our support team at 1-800-BANK-HELP</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="submit" 
                  className="px-8"
                  disabled={!amount || !accountType || !withdrawalMethod}
                  onClick={handleSubmit}
                >
                  Withdraw
                  <ArrowRightCircle className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </CardFooter>
          )}
        </Card>
      </motion.div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to withdraw ${amount} from your {accounts.find(acc => acc.id === accountType)?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmWithdrawal}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}