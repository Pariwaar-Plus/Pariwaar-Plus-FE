"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Mail, Phone, Lock, Calendar,
  GraduationCap, Briefcase, MapPin, UserPlus,
  Loader2, X, BadgeCheck, FileText, Navigation,
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

import { createCareAgent } from "../api/care-agent.api";
import {
  saharaStaffSchema,
  SaharaStaffFormValues,
} from "../schemas/care-agent.schema";

interface AddSaharaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ── Shared style constants ── */
const inputClass =
  "h-9 text-sm bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500";

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

/* ── Section label ── */
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

/* ── Input with leading icon ── */
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

export function AddSaharaModal({ open, onOpenChange }: AddSaharaModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<SaharaStaffFormValues>({
    resolver: zodResolver(saharaStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      secondaryPhone: "",
      gender: "FEMALE",
      dateOfBirth: "",
      qualification: "",
      experience: 0,
      specialization: "",
      city: "",
      ward: "",
      tole: "",
      district: "",
      longitude: 0,
      latitude: 0,
      citizenshipNo: "",
      licenseNo: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createCareAgent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["care-agents"] });
      toast.success(`Staff registered! ID: ${data.employeeId}`);
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register staff");
    },
  });

  const onSubmit = (values: SaharaStaffFormValues) => {
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
                Add New Sahara Staff
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                A welcome email with login credentials will be sent after registration.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form body ── */}
        <div className="px-6 py-5 max-h-[62vh] overflow-y-auto">
          <Form {...form}>
            <form
              id="add-sahara-form"
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
                          <Input {...field} type="password" className={inputClass} placeholder="Min. 8 characters" />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Primary Phone</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Phone}>
                          <Input {...field} className={inputClass} placeholder="+977 98XXXXXXXX" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
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
                          <Input {...field} className={inputClass} placeholder="+977 98XXXXXXXX" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Personal Details ── */}
              <SectionLabel>Personal Details</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Date of Birth</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Calendar}>
                          <Input {...field} type="date" className={inputClass} />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Identity & Credentials ── */}
              <SectionLabel>Identity &amp; Credentials</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="citizenshipNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Citizenship No.</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={BadgeCheck}>
                          <Input {...field} className={inputClass} placeholder="e.g. 12-34-56-78901" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        License No.{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={FileText}>
                          <Input {...field} className={inputClass} placeholder="e.g. NMC-XXXXX" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Professional Info ── */}
              <SectionLabel>Professional Info</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Qualification</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={GraduationCap}>
                          <Input {...field} className={inputClass} placeholder="e.g. BSc Nursing" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Experience (Years)</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Briefcase}>
                          <Input
                            type="number"
                            min={0}
                            className={inputClass}
                            {...field}
                            onChange={(e) => {
                              const val = e.target.valueAsNumber;
                              field.onChange(isNaN(val) ? 0 : val);
                            }}
                          />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>
                      Specializations{" "}
                      <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={inputClass}
                        placeholder="e.g. Elderly Care, Wound Care, Physiotherapy"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* ── Location ── */}
              <SectionLabel>Location</SectionLabel>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>City</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={MapPin}>
                          <Input {...field} className={inputClass} placeholder="Baneshwor" />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        District{" "}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClass} placeholder="Kathmandu" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Ward</FormLabel>
                      <FormControl>
                        <Input {...field} className={inputClass} placeholder="7" />
                      </FormControl>
                      <FormMessage className="text-xs" />
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
                        <Input {...field} className={inputClass} placeholder="Chabahil" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Latitude{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Navigation}>
                          <Input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="e.g. 27.7172"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.valueAsNumber;
                              field.onChange(isNaN(val) ? undefined : val);
                            }}
                          />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        Longitude{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Navigation}>
                          <Input
                            type="number"
                            step="any"
                            className={inputClass}
                            placeholder="e.g. 85.3240"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.valueAsNumber;
                              field.onChange(isNaN(val) ? undefined : val);
                            }}
                          />
                        </FieldWithIcon>
                      </FormControl>
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
            form="add-sahara-form"
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
                Register Staff
              </>
            )}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}