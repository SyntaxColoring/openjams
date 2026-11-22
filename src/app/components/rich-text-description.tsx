import { ReactNode } from "react";
import sanitizeHtml from "sanitize-html";

export function RichTextDescription(props: { unsafeHTML: string }): ReactNode {
  const { unsafeHTML } = props;
  // Google Calendar returns:
  // <a>
  // <b>
  // <i>
  // <ul>
  // <ul>/<ol>/<li>
  // <br> instead of <p>, unfortunately
  const sanitizedHTML = sanitizeHtml(unsafeHTML);
  // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- Sanitized above.
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}
