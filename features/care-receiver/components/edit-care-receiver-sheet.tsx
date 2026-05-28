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

interface EditCareReceiverSheetProps {
    receiver: CareReceiver | null;
    isOpen: boolean;
    onClose: () => void;
}

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
            dob: "",
            gender: "MALE",

            address: "",
            city: "",
            googleMapsUrl: "",
            contact: "",

            medicalConditions: "",
            dependencyLevel: "LOW",

            clientId: "",
            assignedAgentId: "",

            status: "ACTIVE",
        },
    });

  /* RESET FORM WHEN RECEIVER CHANGES */
    React.useEffect(() => {
        if (!receiver) return;

        form.reset({
            name: receiver.name,
            dob: receiver.dob,
            gender: receiver.gender ?? "MALE",

            address: receiver.address ?? "",
            city: receiver.city ?? "",
            googleMapsUrl: receiver.googleMapsUrl ?? "",
            contact: receiver.contact ?? "",

            medicalConditions: receiver.medicalConditions.join(", "),
            dependencyLevel: receiver.dependencyLevel,

            clientId: receiver.clientId,
            assignedAgentId: receiver.assignedAgentId ?? "",

            status: receiver.status,
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
            data: {
            ...values,
            medicalConditions: values.medicalConditions
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            },
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[550px]">
            <SheetHeader>
                <SheetTitle>Edit Care Receiver</SheetTitle>
                <SheetDescription>
                    Update details of {receiver?.name}. Click save when you are done.
                </SheetDescription>
            </SheetHeader>

            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-6"
                >
                {/* NAME */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* DOB + GENDER */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>DOB</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
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
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* CONTACT */}
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                {/* ADDRESS */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                {/* CITY + MAP */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="googleMapsUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Google Maps URL</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* MEDICAL */}
                <FormField
                    control={form.control}
                    name="medicalConditions"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Medical Conditions (comma separated)
                        </FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                {/* DEPENDENCY */}
                <FormField
                    control={form.control}
                    name="dependencyLevel"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dependency Level</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />

                {/* LINKS */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="assignedAgentId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Agent ID</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
                </form>
            </Form>
            </SheetContent>
        </Sheet>
    );
}