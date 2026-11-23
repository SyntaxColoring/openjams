import { LayoutProps } from "rwsdk/router";
import { link } from "../links";

export function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <div className="layout">
      <header className="header">
        <nav>
          <a className="header-link" href={link("/")}>
            openjams.nyc
          </a>
          <a className="header-link" href={link("/about")}>
            about
          </a>
          <a className="header-link" href={link("/calendar")}>
            calendar
          </a>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
