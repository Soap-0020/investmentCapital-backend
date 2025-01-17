import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../../../types/command";
import Cache from "../../../types/cache";
import deferReply from "../../../functions/deferReply";
import lookupInvalidAccount from "../../responces/embeds/lookupInvalidAccount";
import portfolioEmbed from "../../responces/embeds/portfolio";

export default {
  data: new SlashCommandBuilder()
    .setName("portfolio")
    .setDescription("View your or another players portfolio.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to lookup.")
        .setRequired(false)
    )
    .toJSON(),
  requiresAccount: true,
  execute: async (
    cache: Cache,
    _,
    interaction: ChatInputCommandInteraction
  ) => {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const userData = cache.investors.find(
      (investor) => investor.user.id == user.id
    );

    if (!userData)
      return await deferReply(
        interaction,
        {
          embeds: [lookupInvalidAccount(user)],
        },
        {
          ephemeral: true,
        }
      );

    await deferReply(interaction, {
      embeds: [portfolioEmbed(user, userData, user !== interaction.user)],
    });
  },
} satisfies Command;
