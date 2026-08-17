import { AppointmentService } from "../../services/appointmentService.ts";
import type { GraphState } from "../graph.ts";
import { z } from "zod";

const ScheduleRequiredFieldSchema = z.object({
  professionalId: z.number({ error: "Professional ID is required" }),
  datetime: z.string({ error: "Appointment datetime is required" }),
  patientName: z.string({ error: "Patient name is required" }),
});

export function createSchedulerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Scheduling appointment...`);

    try {
      const validation = ScheduleRequiredFieldSchema.safeParse(state);

      if (!validation.success) {
        const errorMessages = validation.error.issues
          .map((e) => e.message)
          .join(",");

        return {
          actionSuccess: false,
          actionError: errorMessages,
        };
      }

      const appointment = appointmentService.bookAppointment(
        validation.data.professionalId,
        new Date(validation.data.datetime),
        validation.data.patientName,
        state.reason ?? "general consult",
      );

      console.log(`✅ Appointment scheduled successfully`);

      return {
        ...state,
        actionSuccess: true,
        appointmentData: appointment,
      };
    } catch (error) {
      console.log(
        `❌ Scheduling failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return {
        ...state,
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : "Scheduling failed",
      };
    }
  };
}
