import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const PostService = {
  getPosts: (page = 1, limit = 10) =>
    api.get<Post[]>(`/posts?_page=${page}&_limit=${limit}`),
  getPost: (id: number) => api.get<Post>(`/posts/${id}`),
  createPost: (post: Omit<Post, "id">) => api.post<Post>("/posts", post),
  updatePost: (post: Post) => api.put<Post>(`/posts/${post.id}`, post),
  deletePost: (id: number) => api.delete(`/posts/${id}`),
};

export const UserService = {
  getUsers: (page = 1, limit = 10) =>
    api.get<User[]>(`/users?_page=${page}&_limit=${limit}`),
  getUser: (id: number) => api.get<User>(`/users/${id}`),
  createUser: (user: Omit<User, "id">) => api.post<User>("/users", user),
  updateUser: (user: User) => api.put<User>(`/users/${user.id}`, user),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};
