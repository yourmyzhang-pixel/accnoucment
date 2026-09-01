const { loadConfig, getGuildConfig } = require('./configStore');

async function handleTemplateAutocomplete(interaction) {
  const focused = interaction.options.getFocused();
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const choices = Object.keys(guildConfig.templates || {});
  const filtered = choices
    .filter((c) => c.toLowerCase().includes(focused.toLowerCase()))
    .slice(0, 25);
  await interaction.respond(filtered.map((c) => ({ name: c, value: c })));
}

module.exports = { handleTemplateAutocomplete };
