import { Handlers, STATUS_CODE } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response("", {
      status: STATUS_CODE.OK,
      headers: { Location: "/" },
    });
  },
};
