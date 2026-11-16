import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYC Open Jams",
};

export default async function Home() {
  return <p>Hello, world!</p>
}
