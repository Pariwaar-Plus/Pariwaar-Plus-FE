"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* API */
import { createCareReceiver } from "../api/care-receiver.api";

/* Schema */
import {
    careReceiverSchema,
    CareReceiverFormValues,
} from "../schemas/care-receiver.schema";

interface AddCareReceiverModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCareReceiverModal({
    open,
    onOpenChange,
}: AddCareReceiverModalProps) {
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

    const mutation = useMutation({
        mutationFn: createCareReceiver,

        onSuccess: () => {
            queryClient.invalidateQueries({
            queryKey: ["care-receivers"],
            });

            toast.success("Care receiver added successfully");

            form.reset();
            onOpenChange(false);
        },

        onError: () => {
            toast.error("Failed to add care receiver");
        },
    });

    const onSubmit = (values: CareReceiverFormValues) => {
        mutation.mutate({
            ...values,

            // convert string → array
            medicalConditions: values.medicalConditions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
                <DialogTitle>Add Care Receiver</DialogTitle>
                <DialogDescription>
                    Create a new care receiver profile linked to a client.
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
                >
                {/* Name */}
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

                {/* DOB + Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
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
                            <Input {...field} placeholder="MALE, FEMALE..." />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                {/* Contact */}
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Address */}
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* City + Map */}
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
                        <FormMessage />
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
                            <Input
                            {...field}
                            placeholder="https://maps.google.com/..."
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                {/* Medical Conditions */}
                <FormField
                    control={form.control}
                    name="medicalConditions"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Medical Conditions (comma separated)
                        </FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            placeholder="Diabetes, BP, Heart Disease"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Dependency Level */}
                <FormField
                    control={form.control}
                    name="dependencyLevel"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dependency Level</FormLabel>
                        <FormControl>
                        <Input
                            {...field}
                            placeholder="LOW, MEDIUM, HIGH"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Relationship Links */}
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="c1, c2..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="assignedAgentId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assigned Agent ID</FormLabel>
                        <FormControl>
                        <Input {...field} placeholder="optional" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                    type="submit"
                    disabled={mutation.isPending}
                    >
                    {mutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                </div>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    );
}