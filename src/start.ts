import startAPI from "./api";
import startBot from "./bot";
import Cache from "./types/cache";
import dotenv from "dotenv";
import startDatabase from "./database/startDatabase";
import { EventEmitter } from "events";
import scheduleTasks from "./scheduledTasks/scheduleTasks";
import { Client } from "discord.js";
dotenv.config();

(async () => {
  const data = await startDatabase();

  const cache: Cache = {
    investors: [], // data.investorData.investors,
    commands: [],
    components: {
      buttons: [],
      stringSelectMenus: [],
      modals: [],
      userSelectMenus: [],
    },
    markets: data.marketData,
    events: new EventEmitter(),
    client: new Client({
      intents: [],
      shards: "auto",
    }),
  };

  startBot(cache);
  startAPI(cache);
  scheduleTasks(cache);
})();
