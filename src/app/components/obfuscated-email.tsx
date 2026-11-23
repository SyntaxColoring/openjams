"use client";

import { Fragment, useEffect, useRef } from "react";

interface Props {
  /*
   * `btoa(plaintextEmail)`.
   *
   * This value is serialized into the RSC payload and is visible to bots.
   */
  encodedEmail: string;
}

/**
 * A link like:
 *
 * <a href="mailto:email@example.com">email@example.com</a>
 *
 * Obfuscated to resist scrapers. The user-visible text is interspersed with invisible
 * spans, and the href is populated by JavaScript.
 *
 * https://spencermortensen.com/articles/email-obfuscation/
 */
export function ObfuscatedEmailLink({ encodedEmail }: Props) {
  const email = atob(encodedEmail);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ref.current?.setAttribute("href", `mailto:${email}`);
  }, [email]);

  return (
    <a ref={ref}>
      {[...email].map((char, i) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key
        <Fragment key={i}>
          <span style={{ display: "none" }}>x@</span>
          {char}
        </Fragment>
      ))}
    </a>
  );
}
