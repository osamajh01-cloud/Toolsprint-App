import { redirect } from "next/navigation";

/**
 * app/(tools)/tools/category/page.tsx
 *
 * /tools/category has no content of its own — without this file the URL
 * would fall through to /tools/[slug] with slug="category" and 404. A
 * user trimming the URL bar gets sent to the full directory instead.
 */
export default function CategoryIndexPage() {
  redirect("/tools");
}
