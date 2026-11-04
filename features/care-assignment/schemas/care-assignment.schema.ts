import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const careAssignmentSchema = z.object({
  careAgentId: z.uuid("Care agent is required"),
  careReceiverId: z.uuid("Invalid care receiver"),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Start date is required",
  }),
  endDate: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "Invalid end date",
    }),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "ON_DEMAND"], {
    message: "Visit frequency is required",
  }),
  notes: optionalString,
});

export const updateCareAssignmentSchema = careAssignmentSchema
  .omit({ careAgentId: true, careReceiverId: true })
  .partial();

export type CareAssignmentFormValues = z.infer<typeof careAssignmentSchema>;
export type UpdateCareAssignmentFormValues = z.infer<
  typeof updateCareAssignmentSchema
>;
