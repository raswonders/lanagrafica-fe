import { describe, expect, test } from "vitest";
import { getMembers } from "./memberServiceProd";

describe("getMembers", () => {
  test("returns 10 members", async () => {
    const members = await getMembers("all", 0);
    expect(members);
    expect(members).toHaveLength(10);
  });

  test("returns [] when no data are available", async () => {
    const members = await getMembers("all", 999_999_999);
    expect(members).toEqual([]);
  });

  test("returns only active members", async () => {
    const members = await getMembers("active", 0);
    expect(members.every((member) => member.isActive)).toBe(true);
  });

  test("returns only inactive members", async () => {
    const members = await getMembers("inactive", 0);
    expect(members.length).toBeGreaterThan(0);
    expect(members.every((member) => !member.isActive)).toBe(true);
  });
});
