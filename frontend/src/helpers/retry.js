const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Function to retry a request a number (usually 3) of times.
export const retry = async (func, max_retries = 3, backoff = 500) => {
  let retries = 0;
  // This function will retry the HTTP request (func) given to it, coupled with the axios instance interceptor
  // This will ensure that a new backendURL is retrieved before the next request is sent (up to 3 requests to three different backend URL's in case of failure)
  while (retries < max_retries) {
    try {
      const response = await func();
      return response;
    } catch (error) {
      retries++;
      if (retries === max_retries) {
        throw error;
      }
      await sleep(backoff);
    }
  }
};
