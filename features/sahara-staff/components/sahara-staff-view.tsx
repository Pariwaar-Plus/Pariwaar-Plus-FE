"use client";

import * as React from "react";
import { AgentList } from "@/features/sahara-staff/components/agent-list";
import { AddSaharaModal } from "@/features/sahara-staff/components/add-sahara-modal";
import { AddActionButton } from "@/components/shared/buttons/add-action-button.component";

export function CareAgentsView() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Sahara Staff
          </h2>
          <p className="text-muted-foreground">
            Manage and assign care agents efficiently.
          </p>
        </div>

        <AddActionButton label="Add Sahara Staff" onClick={() => setOpen(true)} />
      </div>

      {/* Add Modal */}
      <AddSaharaModal
        open={open}
        onOpenChange={setOpen}
      />

      {/* Table (React Query owns data inside this) */}
      <AgentList />
    </div>
  );
}