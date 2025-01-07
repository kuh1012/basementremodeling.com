import { loader, requestData } from "../../../../source/scripts/utils";
import { testimonialsData } from "./testimonials";

requestData(`/api/reviews/all`);
loader(testimonialsData);