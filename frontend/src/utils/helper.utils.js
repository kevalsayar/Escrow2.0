import { toast } from "react-toastify";
import { ERROR_CODES, TOAST_RESPONSE } from "./constants.utils";
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
 * Helper function to check the error thrown.
 * @param {Object} error contains details of the error thrown.
 */
export const checkError = (error) => {
  if (error.code === ERROR_CODES.USER_REJECTED_REQUEST) {
    toastMessage(error.message, "toast_denied_error", TOAST_RESPONSE.ERROR);
  } else if (error.code === ERROR_CODES.RESOURCE_BUSY) {
    toastMessage(error.message, "toast_resource_error", TOAST_RESPONSE.ERROR);
  } else if (error.code === ERROR_CODES.TRANSACTION_REJECTED) {
    toastMessage(error.message, "toast_resource_error", TOAST_RESPONSE.ERROR);
  }
};

/**
 * Helper function which takes in the address and manipulates it in such a way that is to be displayed to user.
 * @param {string} address
 * @param {number} offset
 * @returns the wallet address that is to be displayed
 */
export const displayWalletAddress = (address, offset) => {
  return (
    address?.substring(0, offset) +
    "..." +
    address?.substring(address.length - offset)
  );
};

/**
 * Helper function for API call.
 * @param {string} method
 * @param {string} route
 * @param {Object} values
 * @param {Object} params
 * @returns response from the API call or error incase if any.
 */
export const APIcall = async (method, route, values = {}, params = {}) => {
  try {
    return await axiosIntance[method](route, { ...values }, { ...params });
  } catch (error) {
    return error;
  }
};

/**
 * Helper function that Copies the text to clipboard
 * @param {string} text
 */
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};
