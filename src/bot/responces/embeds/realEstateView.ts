import { EmbedBuilder, User } from "discord.js";
import addDefaults from "./defaults/addDefaults";
import RealEstate from "../../../types/realEstate";
import realEstateConfig from "../../../config/realEstateConfig";
import capitalizeWords from "../../../functions/capitalizeWords";
import Markets from "../../../types/markets/markets";
import formatNumber from "../../../functions/formatNumber";
import MarkdownManager from "../../../classes/markdownManager";
import DateFormats from "../../../enum/dateFormats";
import realEstateUpgradesConfig from "../../../config/realEstateUpgradesConfig";
import Emojis from "../../../classes/emojis";
import calculateRealEstateValue from "../../../functions/calculateRealEstateValue";

const realEstateViewEmbed = (
  user: User,
  prestige: number,
  realEstate: RealEstate,
  markets: Markets
) => {
  const config = realEstateConfig[realEstate.type];
  const possibleUpgrades = Object.entries(realEstateUpgradesConfig).filter(
    ([_, config]) => config.allowedRealEstate.includes(realEstate.type)
  );

  return addDefaults(
    new EmbedBuilder()
      .setColor("Blue")
      .setTitle(realEstate.name)
      .setThumbnail(config.image)
      .addFields(
        {
          name: "Type",
          value: config.emoji + " " + capitalizeWords(realEstate.type),
          inline: true,
        },
        {
          name: "Value",
          value:
            `${Emojis.cash} $` +
            formatNumber(calculateRealEstateValue(realEstate, markets)),
          inline: true,
        },
        {
          name: "Created",
          value:
            Emojis.clock +
            " " +
            MarkdownManager.date(realEstate.created, DateFormats.relative),
          inline: true,
        },

        ...(realEstate.built
          ? [
              {
                name: "Rent",
                value:
                  `${Emojis.moneyBag} $` + formatNumber(config.rent) + "/hour",
                inline: false,
              },

              ...possibleUpgrades.map(([name, config]) => {
                const upgradeData = realEstate.upgrades.find(
                  (upgrade) => upgrade.type == name
                );

                return {
                  name: config.emoji + " " + capitalizeWords(name),
                  value:
                    config.requiredPrestige > prestige
                      ? `${Emojis.lock} Unlocked at prestige ${config.requiredPrestige}.`
                      : !upgradeData
                      ? `Price: $${formatNumber(
                          config.price
                        )}\nValue Multiplier: ${config.valueMultiplier}x`
                      : upgradeData.completed
                      ? "Created " +
                        MarkdownManager.date(
                          upgradeData.created,
                          DateFormats.relative
                        )
                      : "Completed " +
                        MarkdownManager.date(
                          upgradeData.created + config.upgradeTime,
                          DateFormats.relative
                        ),
                  inline: true,
                };
              }),
            ]
          : [
              {
                name: "Construction Finished",
                value:
                  Emojis.hammer +
                  " " +
                  MarkdownManager.date(
                    realEstate.created + config.buildTime,
                    DateFormats.relative
                  ),
              },
            ])
      ),
    user
  );
};

export default realEstateViewEmbed;
