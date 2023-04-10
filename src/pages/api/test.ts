import { APIRoute } from "astro";

export async function get({ params }) {
  return new Response("Hello, world!");
}
