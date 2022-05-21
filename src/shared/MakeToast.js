import { toast } from "react-toastify";

/**
 * Make a toast popup on the top right
 * @param {String} message 
 * @param {String} type Possible values are success, error, and warning
 */
 export default function makeToast(message, type) {
    let options = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    };

    switch (type) {
        case "success":
            toast.success(message, options);
            break;

        case "error":
            toast.error(message, options);
            break;

        case "warning":
            toast.warn(message, options);
            break;
    }
}