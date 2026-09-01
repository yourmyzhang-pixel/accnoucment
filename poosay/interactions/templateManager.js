const { MessageFlags } = require('discord.js');
const { loadConfig, saveConfig, getGuildConfig } = require('../utils/configStore');
const { t } = require('../utils/i18n');

async function handleTemplateCommand(interaction) {
  const sub = interaction.options.getSubcommand();
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';

  if (sub === 'new') {
    const id = interaction.options.getString('id').trim();

    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return interaction.reply({ content: t(lang, 'template.invalidId'), flags: MessageFlags.Ephemeral });
    }
    if (guildConfig.templates[id]) {
      return interaction.reply({
        content: t(lang, 'template.alreadyExists', { id }),
        flags: MessageFlags.Ephemeral,
      });
    }

    guildConfig.templates[id] = {
      mentionType: 'none',
      roleId: '',
      title: t(lang, 'template.defaultTitle'),
      description: t(lang, 'template.defaultDescription'),
      color: '#5865F2',
      author: { name: '', iconUrl: '', url: '' },
      footer: { text: '', iconUrl: '' },
      includeThreadLink: true,
      image: { cropSquare: true, blur: 0 },
    };
    saveConfig(config);

    return interaction.reply({ content: t(lang, 'template.created', { id }), flags: MessageFlags.Ephemeral });
  }

  if (sub === 'del') {
    const id = interaction.options.getString('id');

    if (!guildConfig.templates[id]) {
      return interaction.reply({ content: t(lang, 'template.notFound', { id }), flags: MessageFlags.Ephemeral });
    }

    const usedBy = guildConfig.forums.filter((f) => f.templateId === id);
    if (usedBy.length > 0) {
      const list = usedBy.map((f) => `<#${f.forumChannelId}>`).join(', ');
      return interaction.reply({
        content: t(lang, 'template.inUse', { id, forums: list }),
        flags: MessageFlags.Ephemeral,
      });
    }

    delete guildConfig.templates[id];
    saveConfig(config);

    return interaction.reply({ content: t(lang, 'template.deleted', { id }), flags: MessageFlags.Ephemeral });
  }
}

module.exports = { handleTemplateCommand };
