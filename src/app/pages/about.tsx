import { ObfuscatedEmailLink } from "../components/obfuscated-email";

export function About() {
  return (
    <div className="text-container">
      <h2>About</h2>
      <p>
        This website shows upcoming events around NYC where you can play music
        with other people. It's run by{" "}
        <a href="https://marrone.nyc">Max Marrone</a>.
      </p>
      <h2>Contributing</h2>
      <p>
        If there's a jam you like and it's missing from this list, please let me
        know. Email the details to{" "}
        <ObfuscatedEmailLink encodedEmail={btoa("max@marrone.nyc")} />.
      </p>
      <p>Requirements:</p>
      <ul>
        <li>
          The jam must advertise itself and publish updates somewhere public.
          For example, Instagram or Meetup. A personal Instagram is fine.
        </li>
        <li>
          The jam must be open to any musician who shows up. (Not invite-only,
          and not hostile to beginners.)
        </li>
      </ul>
    </div>
  );
}
