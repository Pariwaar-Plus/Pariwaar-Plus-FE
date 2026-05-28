"use client";

import * as React from "react";
import { AddCareReceiverModal } from "./add-care-receiver-modal";
import { AddActionButton } from "@/components/shared/buttons/add-action-button.component";

import { CareReceiverList } from "./care-receiver-list";

export function CareReceiverView() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Pariwaar+ Care Receivers
                </h2>
                <p className="text-muted-foreground">
                    Manage care receivers efficiently
                </p>
            </div>

            <AddActionButton label="Add Care Receiver" onClick={() => setOpen(true)} />
            </div>

            {/* Add Modal */}
            <AddCareReceiverModal
                open={open}
                onOpenChange={setOpen}
            />

            {/* Table (React Query owns data inside this) */}
            <CareReceiverList />
        </div>
    );
}