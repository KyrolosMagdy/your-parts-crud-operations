"use client";

import FullPageSpinner from "@/components/LoadingSpinner";
import PostList from "@/components/postsList";
import Snackbar from "../../components/Snackbar";
import usePostsStore from "@/store/usePostsStore";

export default function PostsPage() {
  const {
    successMessage,
    failureMessage,
    isLoading,
    setSuccessMessage,
    setFailureMessage,
  } = usePostsStore();
  return (
    <div className="container mx-auto p-4">
      {successMessage && (
        <Snackbar
          message={successMessage}
          type="success"
          isVisible={true}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {failureMessage && (
        <Snackbar
          type="error"
          message={failureMessage}
          isVisible={true}
          onClose={() => setFailureMessage("")}
        />
      )}
      <FullPageSpinner isLoading={isLoading} />
      <PostList />
    </div>
  );
}
