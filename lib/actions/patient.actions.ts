'use server'

import { AppwriteException, ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"

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
