function createUserSummary(firstName, lastName, role) {
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (role === "ADMIN") {
    return {
      fullName: `${firstName} ${lastName}`,
      roles: [role],
      message: `Admin ${firstName} ${lastName} registered`,
    };
  }

  return {
    fullName: `${firstName} ${lastName}`,
    roles: [role],
    message: `User ${firstName} ${lastName} registered as ${role}`,
  };
}

module.exports = {
  createUserSummary,
};