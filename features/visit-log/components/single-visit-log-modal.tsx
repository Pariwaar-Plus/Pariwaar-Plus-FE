import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getVisitLogById } from "../api/visit-log.api";
import { VisitCard } from "./visit-history-modal";


interface VisitDetailModalProps {
    visitId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VisitDetailView({
    visitId,
    open,
    onOpenChange,
}: VisitDetailModalProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["single-visit", visitId],
        queryFn: () => getVisitLogById(visitId!),
        enabled: !!visitId && open,
    });

    const visit = data;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>Visit History</DialogTitle>
                    <DialogDescription>
                        {`Log Details: ${data?.careAgent?.user.name} -->  ${data?.assignment?.careReceiver?.name} `}

                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                    {isLoading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-28 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="p-6 text-center text-sm text-red-500">
                            {(error as Error)?.message ?? "Failed to load visit history"}
                        </div>
                    )}



                    {visit && <VisitCard key={visit.id} visit={visit} />}
                </div>
            </DialogContent>
        </Dialog>
    );
}