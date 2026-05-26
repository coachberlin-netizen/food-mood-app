import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const _p = pino({
  level: isProd ? "info" : "debug",
  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, ignore: "pid,hostname" },
        },
      }),
});

// Accepts both pino-style (obj, msg) and console-style ("msg:", value)
function makeLogFn(method: "info" | "warn" | "error" | "debug") {
  return (first: unknown, ...rest: unknown[]): void => {
    if (typeof first === "string" && rest.length > 0) {
      // console.error("prefix:", value) → pino({ data }, "prefix: value")
      const data = rest.length === 1 ? rest[0] : rest;
      (_p[method] as any).call(_p, { data }, first);
    } else {
      // pino-style: logger.error({ err }, "msg") or plain string
      (_p[method] as any).call(_p, first, ...rest);
    }
  };
}

const logger = {
  info:  makeLogFn("info"),
  warn:  makeLogFn("warn"),
  error: makeLogFn("error"),
  debug: makeLogFn("debug"),
};

export default logger;
