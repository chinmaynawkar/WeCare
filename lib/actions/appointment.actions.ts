'use server';

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, database, DATABASE_ID } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

/**
 * Creates a new appointment in the database.
 * 
 * @param {CreateAppointmentParams} appointment - The appointment data to be created.
 * @returns {Promise<string | undefined>} A stringified representation of the created appointment, 
 * or undefined if an error occurs.
 * @throws {Error} If an error occurs during the appointment creation process.
 */
export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await database.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment // all appointment data from Frontend
        );

        return parseStringify(newAppointment);
    } catch (error) {
        console.error("An error occurred while creating a new appointment:", error);
        throw error; // Re-throw the error for proper error handling
    }
}

/**
 * Retrieves an appointment from the database by its ID.
 * 
 * @param {string} appointmentId - The unique identifier of the appointment to fetch.
 * @returns {Promise<Object>} A promise that resolves to an object containing the appointment data.
 * @throws {Error} If an error occurs during the fetching process.
 */
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await database.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );

        // Debug: Log the fetched appointment
        console.log("Fetched appointment:", JSON.stringify(appointment, null, 2));

        // Correct the typo and provide a fallback
        return {
            ...parseStringify(appointment),
            primaryPhysician: appointment.primaryPhyisican || appointment.primaryPhysician || "Unknown",
        };
    } catch (error) {
        console.error("An error occurred while fetching the appointment:", error);
        throw error;
    }
}

/**
 * Retrieves a list of recent appointments from the database.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object containing the appointment list and statistics.
 * @throws {Error} If an error occurs during the retrieval process.
 */
export const getRecentAppointmentList = async () => {
    try {
      const appointments = await database.listDocuments(
        DATABASE_ID!,
        APPOINTMENT_COLLECTION_ID!,
        [Query.orderDesc("$createdAt")]
      );
      const initialCounts = {
        scheduledCount: 0,
        pendingCount: 0,
        cancelledCount: 0,
      };
  
      const counts = (appointments.documents as Appointment[]).reduce(
        (acc, appointment) => {
          switch (appointment.status) {
            case "scheduled":
              acc.scheduledCount++;
              break;
            case "pending":
              acc.pendingCount++;
              break;
            case "cancelled":
              acc.cancelledCount++;
              break;
          }
          return acc;
        },
        initialCounts
      );
  
      const data = {
        totalCount: appointments.total,
        ...counts,
        documents: appointments.documents,
      };
  
      return parseStringify(data);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the recent appointments:",
        error
      );
    }
  };

/**
 * Updates an existing appointment in the database.
 * 
 * @param {UpdateAppointmentParams} params - The parameters for updating the appointment.
 * @param {string} params.appointmentId - The unique identifier of the appointment to update.
 * @param {string} params.userId - The user ID associated with the appointment.
 * @param {Object} params.appointment - The updated appointment data.
 * @param {string} params.type - The type of update being performed.
 * @returns {Promise<string | undefined>} A promise that resolves to a stringified representation of the updated appointment, or undefined if an error occurs.
 * @throws {Error} If an error occurs during the update process.
 */
export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type
}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await database.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        );

        if(!updatedAppointment) {
            throw new Error("Failed to update appointment");
        }

        // TODO: Send notification to the patient
        revalidatePath("/admin"); // Revalidate the admin page to reflect the updated appointment
        return parseStringify(updatedAppointment);

    } catch (error) {
        console.error("An error occurred while updating the appointment:", error);
    }
}