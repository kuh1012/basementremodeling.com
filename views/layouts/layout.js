import { webpCheck, lazyLoadImages } from "../../source/scripts/utils";
import { headerMenu } from "../partials/header/header";
import { viewIdeaModal } from "../partials/modals/view-idea/view-idea.modal";
import { saveIdeaModal } from "../partials/modals/save-idea/save-idea.modal";
import { signInModal } from "../partials/modals/sign-in/sign-in.modal";
import { zipCodeButtons } from "../partials/micro-blocks/zip-code/zip-code";
import { selectElements, sendForms } from "../partials/forms/forms";
import { googleAuth } from "../../source/scripts/google.auth";
import { facebookAuth } from "../../source/scripts/facebook.auth";
import { weCanHelpModal } from "../partials/modals/we-can-help/we-can-help.modal";

require('fslightbox');

if(!sessionStorage.getItem(`referrer`)){ 
    sessionStorage.setItem('referrer', new URLSearchParams(window.location.search).get('utm_medium') || document.referrer || 'direct')
} 
// webp checker
webpCheck();

// header menu
headerMenu();

// contact us form
selectElements();
sendForms();

// schedule buttons
zipCodeButtons();

weCanHelpModal()



// try{

//     console.log("Google/Facebook succeeded")
// } catch(e) {
//     console.log("Google/Facebook failed")
// }
// We don't care about these, so we just wait to run them till all is done
viewIdeaModal();
saveIdeaModal();
