import fs from "fs";
import dotenv from "dotenv";
import Command from "../../types/command";
import { REST, Routes } from "discord.js";
import getIdBytoken from "../../functions/getIdByToken";
import Logger from "../../classes/logger";
import Cache from "../../types/cache";
import path from "path";
import CommandExecute from "../../types/commandExecute";
dotenv.config();

export default async (cache: Cache) => {
  Logger.info("Passing commands through handler.");

  for (const folder of fs.readdirSync(path.join(__dirname, "../commands"))) {
    for (const commandFolder of fs.readdirSync(
      path.join(__dirname, `../commands/${folder}`)
    )) {
      const data: Command["data"] = (
        await import(`../commands/${folder}/${commandFolder}/data`)
      ).default;

      const command: Command = {
        category: folder,
        data,
        execute: [],
      };

      for (const executeFile of fs.readdirSync(
        path.join(__dirname, `../commands/${folder}/${commandFolder}/execute`)
      )) {
        const data: CommandExecute = (
          await import(
            `../commands/${folder}/${commandFolder}/execute/${executeFile}`
          )
        ).default;

        if (data.requiresAccount == undefined) data.requiresAccount = true;
        if (data.bypassBlacklist == undefined) data.bypassBlacklist = false;
        command.execute.push(data);
      }

      cache.commands.push(command);
    }
  }

  Logger.success(
    `Passed ${cache.commands.length} command(s) threw the handler`
  );

  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN as string
  );

  rest.put(
    Routes.applicationCommands(getIdBytoken(process.env.TOKEN as string)),
    {
      body: cache.commands.flatMap((command) => command.data),
    }
  );
};
