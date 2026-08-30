const { loadConfig, saveConfig, getGuildConfig } = require('../utils/configStore');
const { t } = require('../utils/i18n');

async function handleLanguageCommand(interaction) {
  const lang = interaction.options.getString('lang');
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  guildConfig.lang = lang;
  saveConfig(config);

  await interaction.reply({ content: t(lang, 'language.changed'), ephemeral: true });
}

module.exports = { handleLanguageCommand };
