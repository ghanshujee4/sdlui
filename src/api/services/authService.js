import { studentClient } from "api";

/**
 * Exchange a Google ID token for an SDL session.
 * Backend should verify the token and return { token, userId } (same as /users/login).
 */
export async function loginWithGoogle(idToken) {
  const { data } = await studentClient.post("/users/google-login", { idToken });
  return data;
}
