import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CareReceiver } from "@/features/care-receiver/types/care-receiver.type";
import { CareAgent } from "@/features/sahara-staff/types/sahara-staff.type";



interface Props {
    open: boolean;
    onClose: () => void;
    filters: any;
    setFilters: (value: any) => void;
    onApply: () => void;
    onReset: () => void;
    careReceivers: CareReceiver[];
    careAgents: CareAgent[];
}

export default function VisitLogFilters({
    open,
    onClose,
    filters,
    setFilters,
    onApply,
    onReset,
    careReceivers,
    careAgents

}: Props) {
    return (
        <Sheet
            open={open}
            onOpenChange={onClose}
        >
            <SheetContent
                side="right"
                className="w-100"
            >
                <SheetHeader>
                    <SheetTitle>
                        Visit Filters
                    </SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6 m-4">
                    {/* Care Receiver */}
                    <div>
                        <Label>
                            Care Receiver
                        </Label>
                        <Select
                            value={filters.careReceiverId}
                            onValueChange={(value) =>
                                setFilters({
                                    ...filters,
                                    careReceiverId: value
                                })
                            }

                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select receiver" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    careReceivers.map(receiver => (
                                        <SelectItem
                                            key={receiver.id}
                                            value={receiver.id}
                                        >
                                            {receiver.name}
                                        </SelectItem>

                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Care Agent */}
                    <div>
                        <Label>
                            Care Agent
                        </Label>
                        <Select
                            value={filters.careAgentId}
                            onValueChange={(value) =>
                                setFilters({
                                    ...filters,
                                    careAgentId: value
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    careAgents.map(agent => (
                                        <SelectItem
                                            key={agent.id}
                                            value={agent.id}
                                        >
                                            {agent.user.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div>
                        <Label>
                            Status
                        </Label>
                        <Select
                            value={filters.status}
                            onValueChange={(value) =>
                                setFilters({
                                    ...filters,
                                    status: value
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SCHEDULED">
                                    Scheduled
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                    Completed
                                </SelectItem>
                                <SelectItem value="MISSED">
                                    Missed
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>
                                From
                            </Label>
                            <input
                                type="date"
                                className="border rounded-md p-2 w-full"
                                value={filters.from}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        from: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>
                                To
                            </Label>
                            <input
                                type="date"
                                className="border rounded-md p-2 w-full"
                                value={filters.to}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        to: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={onReset}
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                onApply();
                                onClose();
                            }}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}