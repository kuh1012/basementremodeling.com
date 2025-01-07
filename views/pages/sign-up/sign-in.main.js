import { signInModal } from "../../partials/modals/sign-in/sign-in.modal";
import { googleAuth } from "../../../source/scripts/google.auth";
import { facebookAuth } from "../../../source/scripts/facebook.auth";

setTimeout(() => {
    googleAuth();
    facebookAuth();
    setTimeout(signInModal,500);
}, 1000)
