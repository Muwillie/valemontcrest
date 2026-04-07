"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  ArrowRight,
  Landmark,
  WalletCards,
  BadgeInfo,
  Banknote,
  Building,
  User,
  CreditCard,
  Globe,
  DollarSign,
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import type { BankAccount, AccountType } from "@/types";

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .min(1, "Amount must be at least $1"),
  recipientName: z.string().min(2, "Recipient name is required"),
  phoneNumber: z
    .string()
    .refine((v) => /^\+\d{10,15}$/.test(v), "Invalid phone number")
    .optional()
    .or(z.literal("")),
  bankName: z.string().max(50, "Bank name too long"),
  accountNumber: z.string().length(13, "Must be 13 digits"),
  routingNumber: z.string().length(9, "Must be 9 digits"),
  accountType: z.string().min(1, "Account type is required"),
  swiftCode: z.string().max(11).optional().or(z.literal("")),
  note: z.string().max(140, "Note too long").optional(),
  saveBeneficiary: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Constants ───────────────────────────────────────────────────────────────

const ACCOUNT_TYPES: AccountType[] = [
  { value: "checking",        label: "Checking Account",         icon: <WalletCards className="w-4 h-4" /> },
  { value: "savings",         label: "Savings Account",          icon: <Banknote className="w-4 h-4" /> },
  { value: "business",        label: "Business Account",         icon: <Building className="w-4 h-4" /> },
  { value: "joint",           label: "Joint Account",            icon: <User className="w-4 h-4" /> },
  { value: "current",         label: "Current Account",          icon: <CreditCard className="w-4 h-4" /> },
  { value: "non-residential", label: "Non-Residential Account",  icon: <Globe className="w-4 h-4" /> },
  { value: "domiciliary",     label: "Domiciliary Account",      icon: <DollarSign className="w-4 h-4" /> },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface TransferFormProps {
  type: "domestic" | "wire";
  accounts?: BankAccount[];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TransferForm({ type }: TransferFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      recipientName: "",
      phoneNumber: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "",
      swiftCode: "",
      note: "",
      saveBeneficiary: false,
    },
  });

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const promise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Transfer failed")), 2000)
    );

    toast.promise(promise, {
      loading: "Processing transfer…",
      success: "Transfer successful",
      error: () => {
        setIsLoading(false);
        return `Transfer of $${data.amount} to ${data.recipientName} failed`;
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className="w-full max-w-4xl lg:w-2/3 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Landmark className="w-6 h-6 text-primary" />
          {type === "wire" ? "Wire Transfer" : "Domestic Transfer"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* ── Amount ─────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <WalletCards className="w-4 h-4" />
                    Transfer Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-7"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Recipient ──────────────────────────────────────────────── */}
            <section className="space-y-4 border-t pt-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeInfo className="w-4 h-4" />
                Recipient Information
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CustomFormField<FormValues>
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="recipientName"
                  label="Beneficiary Account Name"
                  placeholder="John Doe"
                />

                {type === "wire" && (
                  <CustomFormField<FormValues>
                    control={form.control}
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phoneNumber"
                    label="Phone Number"
                  />
                )}
              </div>
            </section>

            {/* ── Bank details ───────────────────────────────────────────── */}
            <section className="space-y-4 border-t pt-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Landmark className="w-4 h-4" />
                Bank Account Details
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CustomFormField<FormValues>
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="bankName"
                  label="Bank Name"
                />

                <CustomFormField<FormValues>
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="accountNumber"
                  label="Beneficiary Account Number"
                />

                <CustomFormField<FormValues>
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="routingNumber"
                  label="Routing Number"
                />

                {/* Account Type — needs Select, so we use FormField directly */}
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACCOUNT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              <span className="flex items-center gap-2">
                                {t.icon}
                                {t.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === "wire" && (
                  <CustomFormField<FormValues>
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    name="swiftCode"
                    label="SWIFT / BIC Code"
                    placeholder="e.g. BOFAUS3N"
                  />
                )}
              </div>
            </section>

            {/* ── Note & save beneficiary ────────────────────────────────── */}
            <section className="space-y-4 border-t pt-6">
              <CustomFormField<FormValues>
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Transfer Note"
                placeholder="Add a message to the recipient"
              />

              <FormField
                control={form.control}
                name="saveBeneficiary"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Save as Beneficiary</FormLabel>
                  </FormItem>
                )}
              />
            </section>

            {/* ── Submit ─────────────────────────────────────────────────── */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Transfer…
                  </>
                ) : (
                  <>
                    Confirm Transfer
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}