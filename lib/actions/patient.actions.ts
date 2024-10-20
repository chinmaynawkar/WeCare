'use server'

import { AppwriteException, ID, Query } from "node-appwrite"

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  database,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
// below is responsible for uploading the file to the storage
import { InputFile } from "node-appwrite/file"

/**
 * Creates a new user or retrieves an existing user with the given email.
 * 
 * @param {CreateUserParams} user - The user data containing name, email, and phone.
 * @returns {Promise<User | undefined>} The created or existing user, or undefined if an error occurs.
 * @throws {Error} If an unexpected error occurs during user creation or retrieval.
 */
export const createUser = async (user: CreateUserParams) => {
    try {
        console.log('Creating user...')
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
        return newUser
    } catch (error) {
        if (error instanceof AppwriteException) {
            // Handle Appwrite-specific errors
            if (error.code === 409) {
                // User already exists, try to fetch the existing user
                const existingUser = await users.list([
                    Query.equal('email', [user.email])
                ])
                return existingUser?.users[0]
            }
        }
        console.error("Error creating user:", error)
        throw error; // Re-throw unexpected errors
    }
}

/**
 * Retrieves a user by their user ID.
 * 
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<string | undefined>} A stringified user object, or undefined if an error occurs.
 */
export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);
      return parseStringify(user); // Convert user object to string
    } catch (error) {
      console.log(error)
    }
}

/**
 * Registers a new patient with the provided information and optional identification document.
 * 
 * @param {RegisterUserParams} params - The patient registration data, including an optional identification document.
 * @returns {Promise<string | undefined>} A stringified patient object, or undefined if an error occurs.
 */
export const registerPatient = async ({
    identificationDocument,
    ...patient
  }: RegisterUserParams) => {
    try {
      // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
      let file;
      if (identificationDocument) {
        const inputFile =
          identificationDocument &&
          InputFile.fromBuffer(
            identificationDocument?.get("blobFile") as Blob,
            identificationDocument?.get("fileName") as string
          );
  
        file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      }
  
      // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
      const newPatient = await database.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id ? file.$id : null,
          identificationDocumentUrl: file?.$id
            ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
            : null,
          ...patient,
        }
      );
  
      return parseStringify(newPatient);
    } catch (error) {
      console.error("An error occurred while creating a new patient:", error);
    }
  };

/**
 * Retrieves a patient by their user ID.
 * 
 * @param {string} userId - The ID of the user associated with the patient.
 * @returns {Promise<string | undefined>} A stringified patient object, or undefined if an error occurs.
 */
export const getPatient = async (userId: string) => {
    try {
      const patients = await database.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [Query.equal('userId', [userId])]
      );
      return parseStringify(patients.documents[0]); // Convert user object to string
    } catch (error) {
      console.log(error)
    }
}