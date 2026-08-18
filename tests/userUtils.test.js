const {
  createUserSummary,
} = require("../src/utils/userUtils");

describe("createUserSummary", () => {
  test("returns the correct full name", () => {
    const result = createUserSummary(
      "John",
      "Smith",
      "CUSTOMER"
    );

    expect(result.fullName).toEqual("John Smith");
  });

  test("message contains the user role", () => {
    const result = createUserSummary(
      "John",
      "Smith",
      "CUSTOMER"
    );

    expect(result.message).toContain("CUSTOMER");
  });

  test("roles array has one item", () => {
    const result = createUserSummary(
      "John",
      "Smith",
      "CUSTOMER"
    );

    expect(result.roles).toHaveLength(1);
  });

  test("throws error when first name is missing", () => {
    expect(() => {
      createUserSummary("", "Smith", "CUSTOMER");
    }).toThrow(
      "First name and last name are required"
    );
  });
});