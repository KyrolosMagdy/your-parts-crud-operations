import { describe, it, expect, beforeEach } from "vitest";
import useTempUsersStore from "../store/useUsersStore";
import type { User } from "@/services/api";

describe("useTempUsersStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    useTempUsersStore.setState({ tempUsers: [] });
  });

  const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  };

  const mockUser2: User = {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "0987654321",
  };

  it("should initialize with an empty array of tempUsers", () => {
    const state = useTempUsersStore.getState();
    expect(state.tempUsers).toEqual([]);
  });

  it("should add a temp user", () => {
    const { addTempUser } = useTempUsersStore.getState();

    addTempUser(mockUser);

    const state = useTempUsersStore.getState();
    expect(state.tempUsers).toEqual([mockUser]);
  });

  it("should update a temp user", () => {
    const { addTempUser, updateTempUser } = useTempUsersStore.getState();

    addTempUser(mockUser);

    const updatedUser = { ...mockUser, name: "John Updated" };
    updateTempUser(updatedUser);

    const state = useTempUsersStore.getState();
    expect(state.tempUsers[0].name).toBe("John Updated");
  });

  it("should remove a temp user", () => {
    const { addTempUser, removeTempUser } = useTempUsersStore.getState();

    addTempUser(mockUser);
    addTempUser(mockUser2);

    removeTempUser(1);

    const state = useTempUsersStore.getState();
    expect(state.tempUsers).toEqual([mockUser2]);
  });

  it("should get a temp user by id", () => {
    const { addTempUser, getTempUser } = useTempUsersStore.getState();

    addTempUser(mockUser);
    addTempUser(mockUser2);

    const retrievedUser = getTempUser(2);
    expect(retrievedUser).toEqual(mockUser2);
  });

  it("should return undefined when getting a non-existent user", () => {
    const { getTempUser } = useTempUsersStore.getState();

    const retrievedUser = getTempUser(999);
    expect(retrievedUser).toBeUndefined();
  });

  it("should handle multiple operations", () => {
    const { addTempUser, updateTempUser, removeTempUser, getTempUser } =
      useTempUsersStore.getState();

    addTempUser(mockUser);
    addTempUser(mockUser2);

    updateTempUser({ ...mockUser, name: "John Updated" });
    removeTempUser(2);

    const state = useTempUsersStore.getState();
    expect(state.tempUsers.length).toBe(1);
    expect(state.tempUsers[0].name).toBe("John Updated");
    expect(getTempUser(2)).toBeUndefined();
  });
});
