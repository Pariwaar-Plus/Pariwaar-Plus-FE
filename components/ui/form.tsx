"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
    Controller,
    FormProvider,
    useFormContext,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/* ---------------- Form Provider ---------------- */

const Form = FormProvider

/* ---------------- Field Context ---------------- */

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
    > = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

/* ---------------- Field Component ---------------- */

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
    >({
    ...props
    }: ControllerProps<TFieldValues, TName>) => {
    return (
    <FormFieldContext.Provider value={{ name: props.name }}>
        <Controller {...props} />
    </FormFieldContext.Provider>
    )
}

/* ---------------- Item Context ---------------- */

type FormItemContextValue = {
    id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

/* ---------------- Hook ---------------- */

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
    const itemContext = React.useContext(FormItemContext)
    const { getFieldState, formState } = useFormContext()

    if (!fieldContext) {
        throw new Error("useFormField must be used within <FormField>")
    }

    if (!itemContext) {
        throw new Error("useFormField must be used within <FormItem>")
    }

    const fieldState = getFieldState(fieldContext.name, formState)
    const { id } = itemContext

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    }
}

/* ---------------- Form Item ---------------- */

const FormItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => {
    const id = React.useId()

    return (
    <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
    )
})
FormItem.displayName = "FormItem"

/* ---------------- Label ---------------- */

const FormLabel = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
    >(({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField()

    return (
        <Label
            ref={ref}
            htmlFor={formItemId}
            className={cn(error && "text-destructive", className)}
            {...props}
        />
    )
})
FormLabel.displayName = "FormLabel"

/* ---------------- Control ---------------- */

const FormControl = React.forwardRef<
    React.ElementRef<typeof Slot>,
    React.ComponentPropsWithoutRef<typeof Slot>
    >(({ ...props }, ref) => {
        const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField()

    return (
        <Slot
            ref={ref}
            id={formItemId}
            aria-invalid={!!error}
            aria-describedby={
            error
                ? `${formDescriptionId} ${formMessageId}`
                : formDescriptionId
            }
            {...props}
        />
    )
})
FormControl.displayName = "FormControl"

/* ---------------- Description ---------------- */

const FormDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
        <p
            ref={ref}
            id={formDescriptionId}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
})
FormDescription.displayName = "FormDescription"

/* ---------------- Message ---------------- */

const FormMessage = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField()

    const body = error?.message ?? children

    if (!body) return null

    return (
        <p
            ref={ref}
            id={formMessageId}
            className={cn("text-sm font-medium text-destructive", className)}
            {...props}
        >
            {body}
        </p>
    )
})
FormMessage.displayName = "FormMessage"

/* ---------------- Exports ---------------- */

export {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}