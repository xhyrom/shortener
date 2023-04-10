import { APIRoute } from "astro";

export const get: APIRoute = ({ params }) => {
  return new Response(JSON.stringify(params));
};
