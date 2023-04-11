export const getIp = (request: Request) => {
  return request.headers.get("cf-connecting-ip") ?? "127.0.0.1";
};
