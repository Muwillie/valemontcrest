"use client";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import type { E164Number } from "libphonenumber-js/core";
import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ─── Field type enum ────────────────────────────────────────────────────────

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
  TEXTAREA = "textarea",
  SKELETON = "skeleton",
}

// ─── Props ───────────────────────────────────────────────────────────────────

/**
 * Generic over TFieldValues so every field name is type-safe at the call site:
 *   <CustomFormField<MySchema> name="recipientName" ... />
 */
interface CustomFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fieldType: FormFieldType;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Only used when fieldType === SKELETON */
  renderSkeleton?: (field: unknown) => React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

function CustomFormField<TFieldValues extends FieldValues>({
  control,
  fieldType,
  name,
  label,
  placeholder,
  disabled,
  renderSkeleton,
}: CustomFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {label && <FormLabel>{label}</FormLabel>}

          {fieldType === FormFieldType.INPUT && (
            <FormControl>
              <Input
                placeholder={placeholder}
                disabled={disabled}
                {...field}
              />
            </FormControl>
          )}

          {fieldType === FormFieldType.PHONE_INPUT && (
            <FormControl>
              <PhoneInput
                defaultCountry="US"
                placeholder={placeholder}
                international
                withCountryCallingCode
                value={field.value as E164Number | undefined}
                onChange={field.onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              />
            </FormControl>
          )}

          {fieldType === FormFieldType.TEXTAREA && (
            <FormControl>
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                className="resize-none"
                {...field}
              />
            </FormControl>
          )}

          {fieldType === FormFieldType.SKELETON && renderSkeleton?.(field)}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomFormField;