import { linkFor } from "rwsdk/router";
import type App from "./worker";

/**
 * A helper to make sure we only use URLs that we actually declare.
 */
export const link = linkFor<typeof App>();
