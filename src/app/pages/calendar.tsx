// TODO: Figure out Apple Calendar sharing.
// Also figure out if this URL can be inferred from the .ics link we already have instead of hard-coded.
export function Calendar() {
  return (
    <iframe
      className="calendar-embed"
      src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&title&showTitle=0&showCalendars=0&showTz=0&src=N2YxMmQzOWFiMmI1ODI0MmI0ZDY4Mjg0MjVkODFjZDUwNjY3OTVjMGQxZTBjNDBmYzA1NDNiNTJkYzg4Y2JmMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23b39ddb"
    ></iframe>
  );
}
