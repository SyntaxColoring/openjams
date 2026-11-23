import { layout, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";

import { Document } from "./app/document";
import { Home } from "./app/pages/home";
import { About } from "./app/pages/about";
import { Calendar } from "./app/pages/calendar";
import { Layout } from "./app/layout";

export default defineApp([
  render(
    Document,
    layout(Layout, [
      route("/", Home),
      route("/about", About),
      route("/calendar", Calendar),
    ]),
  ),
]);
