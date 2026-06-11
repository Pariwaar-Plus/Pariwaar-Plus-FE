"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateCareReceiver } from "../api/care-receiver.api";
import { CareReceiver } from "../types/care-receiver.type";
import {
  careReceiverSchema,
  CareReceiverFormValues,
} from "../schemas/care-receiver.schema";
import { Globe, Loader2, MapPin, Phone, Save, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCareReceiverSheetProps {
  receiver: CareReceiver | null;
  isOpen: boolean;
  onClose: () => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );
}

function FieldWithIcon({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
      <div className="[&_input]:pl-9">{children}</div>
    </div>
  );
}

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

const inputClass = cn(
  "h-9 rounded-lg border border-slate-200 dark:border-slate-700",
  "bg-white dark:bg-slate-800/60",
  "text-sm text-slate-800 dark:text-slate-100",
  "placeholder:text-slate-400",
  "focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:border-emerald-400",
  "transition-all duration-150"
);


export function EditCareReceiverSheet({
  receiver,
  isOpen,
  onClose,
}: EditCareReceiverSheetProps) {
  const queryClient = useQueryClient();
  const form = useForm<CareReceiverFormValues>({
    resolver: zodResolver(careReceiverSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "MALE",
      phone: "",
      city: "",
      district: "",
      ward: "",
      tole: "",

      bloodGroup: "",
      medicalCondition: "",
      allergies: "",
      mobilityStatus: "INDEPENDENT",
      // googleMapsUrl: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      clientId: "",


    },
  });

  /* RESET FORM WHEN RECEIVER CHANGES */
  React.useEffect(() => {
    if (!receiver) return;

    form.reset({
      name: receiver.name,

      dateOfBirth: receiver.dateOfBirth ? new Date(receiver.dateOfBirth).toISOString().split("T")[0]
        : "",
      gender: receiver.gender ?? "MALE",

      district: receiver.district ?? "",
      city: receiver.city ?? "",
      ward: receiver.ward ?? "",
      tole: receiver.tole ?? "",
      // googleMapsUrl: receiver.googleMapsUrl ?? "",
      phone: receiver.phone ?? "",

      bloodGroup: receiver.bloodGroup ?? "",
      medicalCondition: receiver.medicalCondition ?? "",
      mobilityStatus: receiver.mobilityStatus,

      clientId: receiver.clientId,

    });
  }, [receiver, form]);

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CareReceiver>;
    }) => updateCareReceiver(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["care-receivers"],
      });
      toast.success("Care receiver updated successfully");
      onClose();
    },

    onError: () => {
      toast.error("Failed to update care receiver");
    },
  });

  const onSubmit = (values: CareReceiverFormValues) => {
    if (!receiver) return;

    mutation.mutate({
      id: receiver.id,
      data: values
    });
  };

  const initials = receiver?.name
    ? receiver.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-125 p-0 flex flex-col gap-0 overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <SheetTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Update Care Receiver Details
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400 mt-0.5 truncate">
                {receiver?.name ?? "Loading…"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Form {...form}>
            <form
              id="edit-client-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* ── Personal ── */}
              <SectionLabel>Personal Information</SectionLabel>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Full Name</FormLabel>
                    <FormControl>
                      <FieldWithIcon icon={User}>
                        <Input {...field} className={inputClass} placeholder="Full name" />
                      </FieldWithIcon>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Contact ── */}
              <SectionLabel>Contact</SectionLabel>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Phone Number</FormLabel>
                    <FormControl>
                      <FieldWithIcon icon={Phone}>
                        <Input {...field} className={inputClass} placeholder="987 654 3210" />
                      </FieldWithIcon>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />



              {/* ── Location ── */}
              <SectionLabel>Location Abroad</SectionLabel>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>District</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass} >Ward No</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="tole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Tole</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Medical Conditions */}
              <SectionLabel>Medical Conditions</SectionLabel>

              <FormField
                control={form.control}
                name="medicalCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>
                      Medical Conditions (comma separated)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Diabetes, BP, Heart Disease"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



            </form>
          </Form>
        </div>

        <div className="px-2 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          {form.formState.isDirty && (
            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </p>
          )}
          <div className={cn("flex items-center gap-2 ml-auto")}>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              form="edit-client-form"
              disabled={mutation.isPending || !form.formState.isDirty}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-semibold",
                "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
                "shadow-sm hover:shadow-md hover:shadow-emerald-500/20",
                "hover:-translate-y-px active:translate-y-0 transition-all duration-150",
                "disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              )}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}