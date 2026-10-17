import axios from "axios";

export class ApiError {
  static getMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Unknown error";
  }
}
