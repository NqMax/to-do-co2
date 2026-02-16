import { AxiosError } from "axios";
import { toast } from "sonner";

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export function handleError(error: unknown) {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse;

    return toast.error(errorData.error.message);
  }
  
  return toast.error("An unexpected error has occurred.");
}
