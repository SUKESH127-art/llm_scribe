/** @format */

import { redirect } from "next/navigation";

/**
 * The root page component. Immediately redirects users to the login page.
 */

export default function HomePage() {
	redirect("/login");
}
