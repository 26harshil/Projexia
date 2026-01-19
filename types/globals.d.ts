export { }

export type UserRole = "admin" | "faculty" | "student";

declare global {
    interface CustomJwtSessionClaims {

        metadata: {
            role?: UserRole;
        }

    }
}