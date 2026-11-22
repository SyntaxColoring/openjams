import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "./app/document";
import { Home } from "./app/pages/home";

export default defineApp([render(Document, [route("/", Home)])]);
