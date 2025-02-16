import { describe, it, expect, beforeEach } from "vitest";
import usePostsStore from "../store/usePostsStore";

describe("usePostsStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    usePostsStore.setState({
      isLoading: false,
      successMessage: "",
      failureMessage: "",
    });
  });

  it("should initialize with default values", () => {
    const state = usePostsStore.getState();

    expect(state.isLoading).toBe(false);
    expect(state.successMessage).toBe("");
    expect(state.failureMessage).toBe("");
  });

  it("should toggle isLoading", () => {
    const { toggleIsLoading } = usePostsStore.getState();

    toggleIsLoading();
    expect(usePostsStore.getState().isLoading).toBe(true);

    toggleIsLoading();
    expect(usePostsStore.getState().isLoading).toBe(false);

    toggleIsLoading(true);
    expect(usePostsStore.getState().isLoading).toBe(true);
  });

  it("should set success message", () => {
    const { setSuccessMessage } = usePostsStore.getState();

    setSuccessMessage("Operation successful");
    expect(usePostsStore.getState().successMessage).toBe(
      "Operation successful"
    );
  });

  it("should set failure message", () => {
    const { setFailureMessage } = usePostsStore.getState();

    setFailureMessage("Operation failed");
    expect(usePostsStore.getState().failureMessage).toBe("Operation failed");
  });

  it("should update multiple states", () => {
    const { toggleIsLoading, setSuccessMessage } = usePostsStore.getState();

    toggleIsLoading(true);
    setSuccessMessage("Loading complete");

    const state = usePostsStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.successMessage).toBe("Loading complete");
    expect(state.failureMessage).toBe("");
  });
});
