const env = process.env.NODE_ENV;

export const klapConfig = {
 apiUrl : env === "development"
        ? process.env.KLAP_API_URL_SANDBOX!
        : process.env.KLAP_API_URL_PROD!,

  apiKey: env === "development"
        ? process.env.KLAP_API_KEY_SANDBOX!
        : process.env.KLAP_API_KEY_PROD!,
};
