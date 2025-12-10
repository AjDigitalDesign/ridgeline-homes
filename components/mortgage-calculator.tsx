"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/lib/seo";

interface MortgageCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrice?: number;
  propertyName?: string;
}

const LOAN_TYPES = [
  { value: "30-fha", label: "30-Year FHA Loan" },
  { value: "30-conv", label: "30-Year Conventional" },
  { value: "15-conv", label: "15-Year Conventional" },
  { value: "20-conv", label: "20-Year Conventional" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function parseNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

export function MortgageCalculator({
  open,
  onOpenChange,
  initialPrice = 400000,
  propertyName,
}: MortgageCalculatorProps) {
  // Form state
  const [homePrice, setHomePrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(22);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanType, setLoanType] = useState("30-fha");
  const [monthlyHoaFees, setMonthlyHoaFees] = useState(150);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(8000);
  const [propertyTaxPercent, setPropertyTaxPercent] = useState(2);
  const [includePmi, setIncludePmi] = useState(true);
  const [monthlyPmi, setMonthlyPmi] = useState(110);

  // Update property tax when home price changes
  useEffect(() => {
    setAnnualPropertyTax(Math.round(homePrice * (propertyTaxPercent / 100)));
  }, [homePrice, propertyTaxPercent]);

  // Reset initial price when modal opens with new price
  useEffect(() => {
    if (open && initialPrice) {
      setHomePrice(initialPrice);
    }
  }, [open, initialPrice]);

  // Calculate down payment amount
  const downPaymentAmount = useMemo(() => {
    return Math.round(homePrice * (downPaymentPercent / 100));
  }, [homePrice, downPaymentPercent]);

  // Get loan term from loan type
  const loanTermYears = useMemo(() => {
    if (loanType.startsWith("15")) return 15;
    if (loanType.startsWith("20")) return 20;
    return 30;
  }, [loanType]);

  // Calculate monthly payment breakdown
  const calculations = useMemo(() => {
    const loanAmount = homePrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    // Principal & Interest (P&I) calculation using amortization formula
    let principalAndInterest = 0;
    if (monthlyInterestRate > 0) {
      principalAndInterest =
        (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      principalAndInterest = loanAmount / numberOfPayments;
    }

    // Monthly property tax
    const monthlyTax = annualPropertyTax / 12;

    // PMI amount (only if enabled)
    const pmiAmount = includePmi ? monthlyPmi : 0;

    // Total monthly payment
    const totalMonthly =
      principalAndInterest + monthlyTax + monthlyHoaFees + pmiAmount;

    return {
      principalAndInterest: Math.round(principalAndInterest * 100) / 100,
      taxes: Math.round(monthlyTax * 100) / 100,
      feesAndDues: monthlyHoaFees,
      pmi: pmiAmount,
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      loanAmount,
    };
  }, [
    homePrice,
    downPaymentAmount,
    interestRate,
    loanTermYears,
    annualPropertyTax,
    monthlyHoaFees,
    includePmi,
    monthlyPmi,
  ]);

  // Pie chart data
  const pieData = useMemo(() => {
    const total =
      calculations.principalAndInterest +
      calculations.taxes +
      calculations.feesAndDues +
      calculations.pmi;
    return {
      principalPercent: (calculations.principalAndInterest / total) * 100,
      taxPercent: (calculations.taxes / total) * 100,
      feesPercent: (calculations.feesAndDues / total) * 100,
      pmiPercent: (calculations.pmi / total) * 100,
    };
  }, [calculations]);

  // Generate conic gradient for pie chart
  const pieGradient = useMemo(() => {
    const p1 = pieData.principalPercent;
    const p2 = p1 + pieData.taxPercent;
    const p3 = p2 + pieData.feesPercent;
    return `conic-gradient(
      #4B6A8C 0% ${p1}%,
      #3D4F5F ${p1}% ${p2}%,
      #B8C97E ${p2}% ${p3}%,
      #E8A87C ${p3}% 100%
    )`;
  }, [pieData]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[90vw] lg:w-[95vw] xl:w-[90vw] max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0 rounded-lg sm:rounded-xl">
        {/* Header */}
        <div className="bg-main-primary text-white p-4 sm:p-6 lg:p-8 relative">
          <AlertDialogCancel className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border-0 rounded-full text-white">
            <X className="size-4 sm:size-5" />
          </AlertDialogCancel>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white pr-8">
              How Your Estimated Monthly Mortgage Payment Is Calculated
            </AlertDialogTitle>
            <p className="text-white/80 mt-2 text-sm sm:text-base">
              Our calculator analyzes your loan amount, interest rate, and term
              to generate an estimated monthly payment. This helps you quickly
              understand what price range is realistic as you search for a home.
            </p>
          </AlertDialogHeader>
        </div>

        {/* Calculator Body */}
        <div className="p-4 sm:p-6 lg:p-3">
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Inputs */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Row 1: Home Price & Down Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Home Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Price
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                        $
                      </span>
                      <Input
                        type="text"
                        value={formatNumber(homePrice)}
                        onChange={(e) =>
                          setHomePrice(parseNumber(e.target.value))
                        }
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Down Payment
                    </label>
                    <div className="flex gap-2">
                      <div className="flex flex-1">
                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          $
                        </span>
                        <Input
                          type="text"
                          value={formatNumber(downPaymentAmount)}
                          onChange={(e) => {
                            const amount = parseNumber(e.target.value);
                            setDownPaymentPercent(
                              Math.round((amount / homePrice) * 100)
                            );
                          }}
                          className="rounded-l-none"
                        />
                      </div>
                      <div className="flex w-24">
                        <Input
                          type="number"
                          value={downPaymentPercent}
                          onChange={(e) =>
                            setDownPaymentPercent(
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="rounded-r-none text-center"
                        />
                        <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Interest Rate & Loan Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Interest Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate
                    </label>
                    <div className="flex">
                      <Input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) =>
                          setInterestRate(parseFloat(e.target.value) || 0)
                        }
                        className="rounded-r-none"
                      />
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Loan Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loan Type
                    </label>
                    <Select value={loanType} onValueChange={setLoanType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 3: HOA Fees & Property Tax */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Monthly HOA Fees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly HOA Fees
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                        $
                      </span>
                      <Input
                        type="text"
                        value={formatNumber(monthlyHoaFees)}
                        onChange={(e) =>
                          setMonthlyHoaFees(parseNumber(e.target.value))
                        }
                        className="rounded-l-none"
                      />
                    </div>
                  </div>

                  {/* Annual Property Tax */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Property Tax
                    </label>
                    <div className="flex gap-2">
                      <div className="flex flex-1">
                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          $
                        </span>
                        <Input
                          type="text"
                          value={formatNumber(annualPropertyTax)}
                          onChange={(e) => {
                            const amount = parseNumber(e.target.value);
                            setAnnualPropertyTax(amount);
                            setPropertyTaxPercent(
                              Math.round((amount / homePrice) * 10000) / 100
                            );
                          }}
                          className="rounded-l-none"
                        />
                      </div>
                      <div className="flex w-24 shrink-0">
                        <Input
                          type="number"
                          step="0.1"
                          value={propertyTaxPercent}
                          onChange={(e) => {
                            const percent = parseFloat(e.target.value) || 0;
                            setPropertyTaxPercent(percent);
                          }}
                          className="rounded-r-none text-center"
                        />
                        <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 4: PMI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Monthly PMI
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Info className="size-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Private Mortgage Insurance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="include-pmi"
                        checked={includePmi}
                        onCheckedChange={(checked) =>
                          setIncludePmi(checked === true)
                        }
                      />
                      <label
                        htmlFor="include-pmi"
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Include PMI
                      </label>
                      <div className="flex flex-1 max-w-40">
                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                          $
                        </span>
                        <Input
                          type="text"
                          value={formatNumber(monthlyPmi)}
                          onChange={(e) =>
                            setMonthlyPmi(parseNumber(e.target.value))
                          }
                          disabled={!includePmi}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Monthly Payment Box */}
                <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-4 text-center">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-main-primary">
                    ${formatCurrency(calculations.totalMonthly)}
                  </p>
                  <p className="text-gray-600 mt-2 font-medium text-sm sm:text-base">
                    Total Amount Per Month
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Excludes Homeowners Insurance
                  </p>
                </div>
              </div>

              {/* Right Column - Pie Chart & Legend */}
              <div className="flex flex-col items-center lg:items-center lg:justify-center order-first lg:order-last">
                {/* Pie Chart */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 mx-auto">
                  <div
                    className="w-full h-full rounded-full"
                    style={{ background: pieGradient }}
                  />
                  {/* Center hole for donut effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-white rounded-full" />
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 sm:space-y-3 mt-6 lg:mt-8 w-full max-w-xs">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-[#4B6A8C] shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">
                      Principal & Interest: $
                      {formatCurrency(calculations.principalAndInterest)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-[#3D4F5F] shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">
                      Taxes: ${formatCurrency(calculations.taxes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-[#B8C97E] shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">
                      Fees / Dues: ${formatCurrency(calculations.feesAndDues)}
                    </span>
                  </div>
                  {calculations.pmi > 0 && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-[#E8A87C] shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700">
                        PMI: ${formatCurrency(calculations.pmi)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-gray-600 space-y-3 sm:space-y-4">
            <p>
              <strong className="underline">Disclaimer</strong>{" "}
              {siteConfig.name} is not a lender and{" "}
              <strong className="underline">does not</strong> offer financing.
              This mortgage calculator is provided solely as a general estimate
              tool for planning purposes. Calculated payments are approximations
              and may not reflect actual loan terms, interest rates, taxes,
              insurance, HOA fees, or other costs associated with homeownership.
              This tool does not constitute an offer of credit,
              prequalification, or financial advice. All mortgage products are
              subject to lender approval and may vary based on individual credit
              profiles and market conditions. Users should contact a licensed
              mortgage lender or financial professional for personalized loan
              information and verified payment amounts.{" "}
            </p>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Trigger button component for easy use
interface MortgageCalculatorButtonProps {
  price: number;
  className?: string;
  children?: React.ReactNode;
}

export function MortgageCalculatorButton({
  price,
  className,
  children,
}: MortgageCalculatorButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <MortgageCalculator
        open={open}
        onOpenChange={setOpen}
        initialPrice={price}
      />
    </>
  );
}
