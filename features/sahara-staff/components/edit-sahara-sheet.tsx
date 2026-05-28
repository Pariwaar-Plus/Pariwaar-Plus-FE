"use client";

import * as React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    User, Phone, MapPin, GraduationCap,
    Briefcase, Calendar, BadgeCheck, FileText,
    Navigation, Loader2, Save, X,
} from "lucide-react";

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
import { cn } from "@/lib/utils";

import { updateCareAgent } from "../api/care-agent.api";
import { CareAgent } from "../types/sahara-staff.type";
import {
    updateSaharaStaffSchema,
    UpdateSaharaStaffFormValues,
} from "../schemas/care-agent.schema";

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass = cn(
    "h-9 rounded-lg border border-slate-200 dark:border-slate-700",
    "bg-white dark:bg-slate-800/60",
    "text-sm text-slate-800 dark:text-slate-100",
    "placeholder:text-slate-400",
    "focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:border-emerald-400",
    "transition-all duration-150"
);

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditSaharaSheetProps {
    agent: CareAgent | null;
    isOpen: boolean;
    onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditSaharaSheet({ agent, isOpen, onClose }: EditSaharaSheetProps) {
    const queryClient = useQueryClient();

    const form = useForm<UpdateSaharaStaffFormValues>({
        resolver: zodResolver(updateSaharaStaffSchema) as Resolver<UpdateSaharaStaffFormValues>,
        defaultValues: {
            name: "",
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
            latitude: undefined,
            longitude: undefined,
            citizenshipNo: "",
            licenseNo: "",
        },
    });

    // Populate form when agent changes
    React.useEffect(() => {
        if (!agent) return;
        form.reset({
            name:            agent.name ?? "",
            phone:           agent.phone ?? "",
            secondaryPhone:  agent.secondaryPhone ?? "",
            gender:          agent.gender ?? "FEMALE",
            dateOfBirth:     agent.dateOfBirth
                                ? agent.dateOfBirth.split("T")[0]   // ISO → date input
                                : "",
            qualification:   agent.qualification ?? "",
            experience:      agent.experience ?? 0,
            specialization:  agent.specialization ?? "",
            city:            agent.city ?? "",
            ward:            agent.ward ?? "",
            tole:            agent.tole ?? "",
            district:        agent.district ?? "",
            latitude:        agent.latitude ?? undefined,
            longitude:       agent.longitude ?? undefined,
            citizenshipNo:   agent.citizenshipNo ?? "",
            licenseNo:       agent.licenseNo ?? "",
        });
    }, [agent, form]);

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSaharaStaffFormValues }) =>
            updateCareAgent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["care-agents"] });
            toast.success("Staff updated successfully");
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update staff");
        },
    });

    const onSubmit = (values: UpdateSaharaStaffFormValues) => {
        if (!agent) return;
        console.log("Submitting values:", values);       // check payload
        console.log("Agent ID:", agent.id);      
        mutation.mutate({ id: agent.id, data: values });
    };

    // Initials avatar
    const initials = agent?.name
        ? agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
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
                                Edit Sahara Staff
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-400 mt-0.5 truncate">
                                {agent?.name ?? "Loading…"} · {agent?.employeeId ?? ""}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* ── Form body (scrollable) ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <Form {...form}>
                        <form
                            id="edit-sahara-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >

                            {/* ── Personal Info ── */}
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

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelClass}>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                                    <Input {...field} className={inputClass} placeholder="Kathmandu" />
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
                                                <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} className={inputClass} placeholder="Bagmati" />
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

                {/* ── Footer actions ── */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                    {/* Unsaved indicator */}
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
                            form="edit-sahara-form"
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