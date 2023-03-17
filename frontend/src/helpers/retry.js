const sleep = ms => new Promise(r => setTimeout(r, ms));

export const retry = async (func, max_retries = 3, backoff = 500) => {
    let retries = 0;
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
}