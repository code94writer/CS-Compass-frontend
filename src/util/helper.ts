import { AxiosResponse } from "axios";

  
  interface ApiResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export const isApiSuccess = (response: AxiosResponse | ApiResponse): boolean => {
  try {
    const data = "data" in response ? response.data : response;

    // If API explicitly returns success flag
    if (data.success === true) return true;

    // If HTTP status code indicates success (for Axios responses)
    if ("status" in response && response.status >= 200 && response.status < 300)
      return true;

    // If message indicates success (case-insensitive)
    if (typeof data.message === "string") {
      const msg = data.message.toLowerCase();
      if (
        msg.includes("success") ||
        msg.includes("uploaded") ||
        msg.includes("updated") ||
        msg.includes("deleted") ||
        msg.includes("created")
      ) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
};
  