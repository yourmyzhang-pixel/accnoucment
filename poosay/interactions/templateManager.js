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
      return interaction.reply({ content: t(lang, 'template.invalidId'), ephemeral: true });
    }
    if (guildConfig.templates[id]) {
      return interaction.reply({
        content: t(lang, 'template.alreadyExists', { id }),
        ephemeral: true,
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

    return interaction.reply({ content: t(lang, 'template.created', { id }), ephemeral: true });
  }

  if (sub === 'del') {
    const id = interaction.options.getString('id');

    if (!guildConfig.templates[id]) {
      return interaction.reply({ content: t(lang, 'template.notFound', { id }), ephemeral: true });
    }

    const usedBy = guildConfig.forums.filter((f) => f.templateId === id);
    if (usedBy.length > 0) {
      const list = usedBy.map((f) => `<#${f.forumChannelId}>`).join(', ');
      return interaction.reply({
        content: t(lang, 'template.inUse', { id, forums: list }),
        ephemeral: true,
      });
    }

    delete guildConfig.templates[id];
    saveConfig(config);

    return interaction.reply({ content: t(lang, 'template.deleted', { id }), ephemeral: true });
  }
}

module.exports = { handleTemplateCommand };
