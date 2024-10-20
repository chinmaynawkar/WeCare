'use server';

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, database, DATABASE_ID } from "../appwrite.config";
import { parseStringify } from "../utils";

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