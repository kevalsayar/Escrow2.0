import { toast } from "react-toastify";
import { TOAST_RESPONSE } from "./constants.utils";
import axiosIntance from "../configs/axios.config";

/**
 * Helper function to show toasts.
 * @param {String} message message to display in the toast.
 * @param {String} toastId unique toastId for each toast.
 * @param {String} response receives success or error and displays message accordingly.
 */
export const toastMessage = (message, toastId, response) => {
  !toast.isActive(toastId) &&
    toast[response](message, {
      toastId: toastId,
    });
};

/**
 * @description Helper function to check the error thrown.
 * @param {Object} error contains details of the error thrown.
 */
export const checkError = (error) =>
  toastMessage(error.message, error.code, TOAST_RESPONSE.ERROR);

/**
 * Helper function which takes in the address and manipulates it in such a way that is to be displayed to user.
 * @param {string} address
 * @param {number} offset
 * @returns the wallet address that is to be displayed
 */
export const displayWalletAddress = (address, offset) =>
  `${address?.substring(0, offset)}...${address?.slice(-offset)}`;

/**
 * Helper function for API call.
 * @param {string} method - The HTTP method for the API call (e.g., 'get', 'post', 'put', 'delete').
 * @param {string} route - The API endpoint or route.
 * @param {object} [values={}] - The data to be sent with the API call (request payload or parameters).
 * @param {object} [params={}] - Additional configuration parameters for the Axios request.
 * @returns {Promise<AxiosResponse|Error>} A promise that resolves with the Axios response or rejects with an error.
 */
export const APIcall = async (method, route, values = {}, params = {}) => {
  try {
    return await axiosIntance[method](route, { ...values }, { ...params });
  } catch (error) {
    return error;
  }
};

/**
 * @description Helper function that Copies the text to clipboard
 * @param {string} text - The text to be copied to the clipboard.
 */
export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const formatDate = (dateString) => {
  let date = new Date(dateString);
  let now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  let toString = new Date(now_utc).toUTCString();
  return toString.split(" ").slice(1).join(" ");
};
