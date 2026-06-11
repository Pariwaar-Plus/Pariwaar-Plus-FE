"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClients } from "@/features/clients/api/client.api";

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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

    const { data: clients = [], isLoading, isError } = useQuery({
        queryKey: ["clients"],
        queryFn: getClients,
    });

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
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5">
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
                                name="dateOfBirth"
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
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger >
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

                        {/* Contact */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number (Mobile Number)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* City + District */}
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
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>District</FormLabel>
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

                        {/* Ward + Tole */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ward"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ward No</FormLabel>
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
                                        <FormLabel>Tole</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="medicalCondition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
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

                        {/* Dependency Level
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
                        /> */}

                        {/* Relationship Links */}
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Client</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoading
                                                            ? "Loading clients..."
                                                            : "Select a client"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent position="popper"
                                            side="bottom"
                                            align="start">
                                            {clients.map((client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={client.id}
                                                >
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
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
                        /> */}

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