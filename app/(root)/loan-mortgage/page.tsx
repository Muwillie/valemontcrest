'use client';

import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useState } from 'react';

export default function LoansAndMortgages() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loanAmount, setLoanAmount] = useState('');
    const [loanDuration, setLoanDuration] = useState('');
    const [mortgageValue, setMortgageValue] = useState('');
    const [downPayment, setDownPayment] = useState('');
    const [mortgageDuration, setMortgageDuration] = useState('');

    const handleLoanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
        toast.promise(promise, {
            loading: 'Processing Loan Application...',
            success: () => {
                // This won't be called since we're rejecting the promise
                setIsLoading(false);
                return `Your application will be reviewed shortly.`;
            },
        });
        setTimeout(() => router.push('/dashboard'), 2000);
    };

    const handleMortgageSubmit = (e: React.FormEvent) => {
        setIsLoading(true);
        e.preventDefault();

        // Simulate API call
        const promise = new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
        toast.promise(promise, {
            loading: 'Processing Mortgage Application...',
            success: () => {
                // This won't be called since we're rejecting the promise
                setIsLoading(false);
                return `Your application will be reviewed shortly.`;
            },
        });
        setTimeout(() => router.push('/dashboard'), 2000);
    };

    const monthlyLoanPayment =
        loanAmount && loanDuration
            ? (parseFloat(loanAmount) / parseInt(loanDuration)).toFixed(2)
            : '0.00';

    const mortgagePrincipal =
        mortgageValue && downPayment
            ? parseFloat(mortgageValue) - parseFloat(downPayment)
            : 0;

    const monthlyMortgagePayment =
        mortgagePrincipal && mortgageDuration
            ? (mortgagePrincipal / (parseInt(mortgageDuration) * 12)).toFixed(2)
            : '0.00';


    return (
        <div className="min-h-screen bg-gray-100 pt-20 lg:pt-0 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Loans & Mortgages</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Loan Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Personal Loan Application</h2>
                        <form className="space-y-4" onSubmit={handleLoanSubmit}>
                            <div>
                                <label className="block text-sm font-medium">Full Name</label>
                                <input required type="text" className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Loan Amount ($)</label>
                                <input
                                    type="number"
                                    required
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Purpose</label>
                                <textarea required className="w-full mt-1 border border-gray-300 rounded-lg p-2" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Repayment Period</label>
                                <select
                                    value={loanDuration}
                                    onChange={(e) => setLoanDuration((e.target.value))}
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                                >
                                    <option value={6}>6 months</option>
                                    <option value={12}>12 months</option>
                                    <option value={24}>24 months</option>
                                    <option value={36}>36 months</option>
                                </select>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm">
                                Estimated Monthly Payment: <strong>${monthlyLoanPayment}</strong>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Apply for Loan
                            </button>
                        </form>
                    </div>

                    {/* Mortgage Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Mortgage Application</h2>
                        <form className="space-y-4" onSubmit={handleMortgageSubmit}>
                            <div>
                                <label className="block text-sm font-medium">Full Name</label>
                                <input required type="text" className="w-full mt-1 border border-gray-300 rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Property Value ($)</label>
                                <input
                                    type="number"
                                    required
                                    value={mortgageValue}
                                    onChange={(e) => setMortgageValue(e.target.value)}
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Down Payment ($)</label>
                                <input
                                    type="number"
                                    required
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Repayment Period</label>
                                <select
                                    value={mortgageDuration}
                                    onChange={(e) => setMortgageDuration((e.target.value))}
                                    className="w-full mt-1 border border-gray-300 rounded-lg p-2"
                                >
                                    <option value={10}>10 years</option>
                                    <option value={15}>15 years</option>
                                    <option value={20}>20 years</option>
                                    <option value={30}>30 years</option>
                                </select>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg text-green-800 text-sm">
                                Estimated Monthly Mortgage: <strong>${monthlyMortgagePayment}</strong>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Apply for Mortgage
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}