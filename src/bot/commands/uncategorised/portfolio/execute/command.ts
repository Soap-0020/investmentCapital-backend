import {
  ActionRowBuilder,
  ButtonBuilder,
  Interaction,
  User,
  UserSelectMenuBuilder,
} from "discord.js";
import Command from "../../../../../types/command";
import Cache from "../../../../../types/cache";
import deferReply from "../../../../../functions/deferReply";
import errorEmbed from "../../../../responces/embeds/error";
import portfolioEmbed from "../../../../responces/embeds/portfolio";
import portfolioMenu from "../../../../responces/components/menus/portfolio";
import stocksViewButton from "../../../../responces/components/buttons/stocksView";
import realEstateViewButton from "../../../../responces/components/buttons/realEstateView";
import CustomIdManager from "../../../../../classes/customIdManager";

export default {
  validateCommand: (cache: Cache, interaction: Interaction) =>
    interaction.isChatInputCommand()
      ? true
      : "customId" in interaction
      ? CustomIdManager.parse(cache, interaction.customId).id == "portfolio"
      : false,
  execute: async (cache: Cache, _, interaction: Interaction) => {
    const user = interaction.isChatInputCommand()
      ? interaction.options.getUser("user") ?? interaction.user
      : interaction.isUserSelectMenu()
      ? (interaction.users.get(interaction.values[0]) as User)
      : interaction.user;

    const userData = cache.investors.find(
      (investor) => investor.user.id == user.id
    );

    if (!userData)
      return await deferReply(
        interaction,
        {
          embeds: [
            errorEmbed(user, "This account doesn't exist.", "Invalid Account"),
          ],
        },
        {
          ephemeral: true,
        }
      );

    await deferReply(interaction, {
      embeds: [portfolioEmbed(user, userData, user !== interaction.user)],
      components: [
        new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
          portfolioMenu(cache, user.id)
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          stocksViewButton(cache),
          realEstateViewButton(cache)
        ),
      ],
    });
  },
} satisfies Command["execute"][number];
