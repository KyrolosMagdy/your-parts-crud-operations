import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  type MockedFunction,
} from "vitest";
import axios from "axios";
import { PostService, UserService } from "../services/api";
import type { Post, User } from "../services/api";

// Mock axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    create: vi.fn().mockReturnThis(),
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  },
}));

describe("API Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PostService", () => {
    const mockPostData: Post = {
      id: 1,
      title: "Test Post",
      body: "Test Body",
      userId: 1,
    };

    it("getPosts makes GET request to correct endpoint", async () => {
      (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: [mockPostData],
      });
      await PostService.getPosts();
      expect(axios.get).toHaveBeenCalledWith("/posts");
    });

    it("getPost makes GET request to correct endpoint with id", async () => {
      (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: mockPostData,
      });
      await PostService.getPost(1);
      expect(axios.get).toHaveBeenCalledWith("/posts/1");
    });

    it("createPost makes POST request to correct endpoint with data", async () => {
      const newPost = { title: "New Post", body: "New Body", userId: 1 };
      (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
        data: { ...newPost, id: 1 },
      });
      await PostService.createPost(newPost);
      expect(axios.post).toHaveBeenCalledWith("/posts", newPost);
    });

    it("updatePost makes PUT request to correct endpoint with data", async () => {
      (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
        data: mockPostData,
      });
      await PostService.updatePost(mockPostData);
      expect(axios.put).toHaveBeenCalledWith(
        `/posts/${mockPostData.id}`,
        mockPostData
      );
    });

    it("deletePost makes DELETE request to correct endpoint", async () => {
      (
        axios.delete as MockedFunction<typeof axios.delete>
      ).mockResolvedValueOnce({ data: {} });
      await PostService.deletePost(1);
      expect(axios.delete).toHaveBeenCalledWith("/posts/1");
    });

    it("handles errors correctly", async () => {
      const error = new Error("Network Error");
      (axios.get as MockedFunction<typeof axios.get>).mockRejectedValueOnce(
        error
      );
      await expect(PostService.getPosts()).rejects.toThrow("Network Error");
    });
  });

  describe("UserService", () => {
    const mockUserData: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    };

    it("getUsers makes GET request to correct endpoint with pagination", async () => {
      (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: [mockUserData],
      });
      await UserService.getUsers(2, 20);
      expect(axios.get).toHaveBeenCalledWith("/users?_page=2&_limit=20");
    });

    it("getUsers uses default pagination values", async () => {
      (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: [mockUserData],
      });
      await UserService.getUsers();
      expect(axios.get).toHaveBeenCalledWith("/users?_page=1&_limit=10");
    });

    it("getUser makes GET request to correct endpoint with id", async () => {
      (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({
        data: mockUserData,
      });
      await UserService.getUser(1);
      expect(axios.get).toHaveBeenCalledWith("/users/1");
    });

    it("createUser makes POST request to correct endpoint with data", async () => {
      const newUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "0987654321",
      };
      (axios.post as MockedFunction<typeof axios.post>).mockResolvedValueOnce({
        data: { ...newUser, id: 2 },
      });
      await UserService.createUser(newUser);
      expect(axios.post).toHaveBeenCalledWith("/users", newUser);
    });

    it("updateUser makes PUT request to correct endpoint with data", async () => {
      (axios.put as MockedFunction<typeof axios.put>).mockResolvedValueOnce({
        data: mockUserData,
      });
      await UserService.updateUser(mockUserData);
      expect(axios.put).toHaveBeenCalledWith(
        `/users/${mockUserData.id}`,
        mockUserData
      );
    });

    it("deleteUser makes DELETE request to correct endpoint", async () => {
      (
        axios.delete as MockedFunction<typeof axios.delete>
      ).mockResolvedValueOnce({ data: {} });
      await UserService.deleteUser(1);
      expect(axios.delete).toHaveBeenCalledWith("/users/1");
    });

    it("handles errors correctly", async () => {
      const error = new Error("Network Error");
      (axios.get as MockedFunction<typeof axios.get>).mockRejectedValueOnce(
        error
      );
      await expect(UserService.getUsers()).rejects.toThrow("Network Error");
    });
  });
});
