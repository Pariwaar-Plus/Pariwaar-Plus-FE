"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Mail, Phone, Lock, MapPin,
  Globe, Clock, CreditCard, UserPlus,
  Loader2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { createClient } from "../api/client.api";
import { clientSchema, ClientFormValues } from "../schemas/client.schema";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ── Shared styles ── */
const inputClass =
  "h-9 text-sm bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500";

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {children}
      </span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
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
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
      <div className="[&_input]:pl-9">{children}</div>
    </div>
  );
}

export function AddClientModal({ open, onOpenChange }: AddClientModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name:           "",
      email:          "",
      password:       "",
      phone:          "",
      countryCode:    "+1",
      secondaryPhone: "",
      country:        "",
      timezone:       "",
      address:        "",
      city:           "",
      billingType:    "MONTHLY",
      paymentStatus:  "PENDING",
    },
  });

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success(`Client registered successfully`);
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to register client");
    },
  });

  const onSubmit = (values: ClientFormValues) => {
    mutation.mutate(values);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-130 p-0 gap-0 overflow-hidden">

        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
              <UserPlus size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Add New Client
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                Create a client who will manage care receivers in Nepal.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form body ── */}
        <div className="px-6 py-5 max-h-[62vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="add-client-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              {/* ── Account Info ── */}
              <SectionLabel>Account Information</SectionLabel>

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

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Email</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Mail}>
                          <Input {...field} type="email" className={inputClass} placeholder="email@example.com" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Password</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Lock}>
                          <Input {...field} type="password" className={inputClass} placeholder="Min. 6 characters" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* ── Location Abroad ── */}
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
                          <Input {...field} className={inputClass} placeholder="e.g. United States" />
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
                          <Input {...field} className={inputClass} placeholder="e.g. America/New_York" />
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
                          <Input {...field} className={inputClass} placeholder="e.g. New York" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            type="submit"
            form="add-client-form"
            disabled={mutation.isPending}
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
                Registering…
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Add Client
              </>
            )}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}