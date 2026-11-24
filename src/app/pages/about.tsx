import { ObfuscatedEmailLink } from "../components/obfuscated-email";

export function About() {
  return (
    <div className="text-container">
      <h2>About</h2>
      <p>
        This website shows upcoming events around NYC where you can play music
        with other people.
      </p>
      <p>
        It's run and curated by me,{" "}
        <a href="https://marrone.nyc">Max Marrone</a>. There's a bias towards
        jams that are friendly to amateur hacks because that's what I am. :)
      </p>
      <h2>Contributing</h2>
      <p>
        If there's a jam you've been to, liked, and it's missing from this list,
        I'd love to hear about it. Email the details to{" "}
        <ObfuscatedEmailLink encodedEmail={btoa("max@marrone.nyc")} />.
      </p>
      <p>To be listed on this site, a jam must:</p>
      <ul>
        <li>
          Advertise itself and publish updates somewhere public. For example,
          Instagram or Meetup. A personal Instagram is fine.
        </li>
        <li>
          Be open to any musician who shows up. (Not invite-only, and not
          hostile to beginners.)
        </li>
      </ul>
    </div>
  );
}
