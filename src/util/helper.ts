interface ApiResponse {
    message?: string;
    status?: number;
    success?: boolean;
    timestamp?: string;
  }
  
  interface AxiosResponse {
    data?: ApiResponse;
    [key: string]: any;
  }
  
  export const  isApiSuccess=(response: AxiosResponse | ApiResponse): boolean => {
    try {
      // Case 1: Axios style response with data wrapper
      if ("data" in response && response.data) {
        return response.data.success === true && response.data.message === "Success";
      }
  
      // Case 2: Direct API response object
      return response.success === true && response.message === "Success";
    } catch {
      return false;
    }
  }
  