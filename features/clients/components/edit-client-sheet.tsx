"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User, Phone, MapPin, Globe,
  Clock, CreditCard, Loader2, Save, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn as utils } from "@/lib/utils";

import { updateClient } from "../api/client.api";
import { Client } from "../types/client.type";
import { updateClientSchema, UpdateClientFormValues } from "../schemas/client.schema";

/* ── Sub-components ── */

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

const inputClass = cn(
  "h-9 rounded-lg border border-slate-200 dark:border-slate-700",
  "bg-white dark:bg-slate-800/60",
  "text-sm text-slate-800 dark:text-slate-100",
  "placeholder:text-slate-400",
  "focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:border-emerald-400",
  "transition-all duration-150"
);

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

interface EditClientSheetProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditClientSheet({ client, isOpen, onClose }: EditClientSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema) as any,
    defaultValues: {
      name:           "",
      phone:          "",
      countryCode:    "",
      secondaryPhone: "",
      country:        "",
      timezone:       "",
      address:        "",
      city:           "",
      billingType:    "MONTHLY",
      paymentStatus:  "PENDING",
    },
  });

  React.useEffect(() => {
    if (!client) return;
    form.reset({
      name:           client.name          ?? "",
      phone:          client.phone         ?? "",
      countryCode:    client.countryCode   ?? "",
      secondaryPhone: client.secondaryPhone ?? "",
      country:        client.country       ?? "",
      timezone:       client.timezone      ?? "",
      address:        client.address       ?? "",
      city:           client.city          ?? "",
      billingType:    client.billingType   ?? "MONTHLY",
      paymentStatus:  client.paymentStatus ?? "PENDING",
    });
  }, [client, form]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientFormValues }) =>
      updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update client");
    },
  });

  const onSubmit = (values: UpdateClientFormValues) => {
    if (!client) return;
    mutation.mutate({ id: client.id, data: values });
  };

  const initials = client?.name
    ? client.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] p-0 flex flex-col gap-0 overflow-hidden">

        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <SheetTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Edit Client
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400 mt-0.5 truncate">
                {client?.name ?? "Loading…"} · {client?.email ?? ""}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* ── Form body ── */}
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

              {/* ── Contact ── */}
              <SectionLabel>Contact</SectionLabel>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Code</FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClass} placeholder="+1" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Primary Phone</FormLabel>
                        <FormControl>
                          <FieldWithIcon icon={Phone}>
                            <Input {...field} className={inputClass} placeholder="987 654 3210" />
                          </FieldWithIcon>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="secondaryPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>
                      Secondary Phone{" "}
                      <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <FieldWithIcon icon={Phone}>
                        <Input {...field} className={inputClass} placeholder="Secondary number" />
                      </FieldWithIcon>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* ── Location ── */}
              <SectionLabel>Location Abroad</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Country</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Globe}>
                          <Input {...field} className={inputClass} placeholder="United States" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Timezone</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Clock}>
                          <Input {...field} className={inputClass} placeholder="America/New_York" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        City{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={MapPin}>
                          <Input {...field} className={inputClass} placeholder="New York" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Address{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClass} placeholder="Street address" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Billing ── */}
              <SectionLabel>Billing</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="billingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Billing Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="OVERDUE">Overdue</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

            </form>
          </Form>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          {form.formState.isDirty && (
            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
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
                  <Save className="w-3.5 h-3.5" />
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