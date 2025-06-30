export function generateUsername(
  firstName: string,
  lastName: string,
  email: string
): string {
  // Try to create username from first and last name
  const nameUsername =
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(
      /[^a-zA-Z0-9]/g,
      ""
    );

  if (nameUsername.length >= 3) {
    return nameUsername;
  }

  // Fallback to email prefix
  const emailUsername = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_]/g, "");

  return emailUsername.length >= 3 ? emailUsername : `user${Date.now()}`;
}
