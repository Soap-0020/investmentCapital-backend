import fs from "fs";
import Event from "../../types/event";
import Execute from "../../types/execute";

export default (async (cache) => {
  for (const file of fs.readdirSync("src/bot/events")) {
    const event: Event = (await import(`../events/${file}`)).default;
    cache.client[event.once ? "once" : "on"](event.event as string, (...data) =>
      event.execute(cache, ...data)
    );
  }
}) satisfies Execute;
