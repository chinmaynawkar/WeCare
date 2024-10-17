'use client'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Control, FieldValues } from "react-hook-form"
import { FormFieldType } from "./PatientForm"
import Image from "next/image"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { E164Number } from 'libphonenumber-js'

  interface CustomFormFieldProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>
    fieldType: FormFieldType
    name: string
    label?: string
    placeholder?: string
    iconSrc?: string
    iconAlt?: string
    dateFormat?: string
    showTimeSelector?: boolean
    children?: React.ReactNode
    render?: (field: FieldValues) => React.ReactNode
  }

  const RenderField = ({field, props}: {field: FieldValues, props: CustomFormFieldProps}) => {
    const {fieldType, iconSrc, iconAlt, placeholder} = props
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                        src={iconSrc}
                        alt={iconAlt || 'icon'}
                        width={24}
                        height={24}
                        className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                        placeholder={placeholder}
                        {...field}
                        className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
          return (
            <FormControl>
              <PhoneInput
                defaultCountry="US"
                value={field.value as E164Number | undefined}
                placeholder={placeholder}
                international
                withCountryCallingCode
                onChange={(value) => field.onChange(value)}
                className="input-phone"
              />
            </FormControl>
          )
    }
  }

export const CustomFormField = (props: CustomFormFieldProps) => {
    const {control, fieldType, name, label} = props
  return (
    <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex-1">
                {fieldType !== FormFieldType.CHECKBOX && label && (
                <FormLabel>{label}</FormLabel>
                )}
              <RenderField field={field} props={props} />
              <FormMessage className="shad-error" />
            </FormItem>
          )}
        />
  )
}
