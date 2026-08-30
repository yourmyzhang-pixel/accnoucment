const { EmbedBuilder } = require('discord.js');
const { loadConfig, saveConfig, getGuildConfig } = require('../utils/configStore');
const { t } = require('../utils/i18n');

async function handleForumCommand(interaction) {
  const sub = interaction.options.getSubcommand();
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';

  if (sub === 'add') {
    const forumChannel = interaction.options.getChannel('forum');
    const announceChannel = interaction.options.getChannel('announce');
    const templateId = interaction.options.getString('template');
    const name = interaction.options.getString('name') || forumChannel.name;

    if (!guildConfig.templates[templateId]) {
      return interaction.reply({
        content: t(lang, 'forum.templateNotFound', { id: templateId }),
        ephemeral: true,
      });
    }

    const exists = guildConfig.forums.find(
      (f) => f.forumChannelId === forumChannel.id
    );
    if (exists) {
      return interaction.reply({
        content: t(lang, 'forum.alreadyAdded', { id: exists.templateId }),
        ephemeral: true,
      });
    }

    guildConfig.forums.push({
      name,
      forumChannelId: forumChannel.id,
      announceChannelId: announceChannel.id,
      templateId,
    });
    saveConfig(config);

    return interaction.reply({
      content: t(lang, 'forum.added', {
        name,
        forumId: forumChannel.id,
        announceId: announceChannel.id,
        template: templateId,
      }),
      ephemeral: true,
    });
  }

  if (sub === 'remove') {
    const forumChannel = interaction.options.getChannel('forum');
    const before = guildConfig.forums.length;
    guildConfig.forums = guildConfig.forums.filter(
      (f) => f.forumChannelId !== forumChannel.id
    );
    if (guildConfig.forums.length === before) {
      return interaction.reply({ content: t(lang, 'forum.notInList'), ephemeral: true });
    }
    saveConfig(config);
    return interaction.reply({
      content: t(lang, 'forum.removed', { forumId: forumChannel.id }),
      ephemeral: true,
    });
  }

  if (sub === 'set') {
    const forumChannel = interaction.options.getChannel('forum');
    const templateId = interaction.options.getString('template');

    if (!guildConfig.templates[templateId]) {
      return interaction.reply({
        content: t(lang, 'forum.templateNotFound', { id: templateId }),
        ephemeral: true,
      });
    }

    const entry = guildConfig.forums.find(
      (f) => f.forumChannelId === forumChannel.id
    );
    if (!entry) {
      return interaction.reply({ content: t(lang, 'forum.notAddedYet'), ephemeral: true });
    }

    entry.templateId = templateId;
    saveConfig(config);
    return interaction.reply({
      content: t(lang, 'forum.setDone', { forumId: forumChannel.id, template: templateId }),
      ephemeral: true,
    });
  }

  if (sub === 'list') {
    if (guildConfig.forums.length === 0) {
      return interaction.reply({ content: t(lang, 'forum.listEmpty'), ephemeral: true });
    }
    const lines = guildConfig.forums.map((f) =>
      t(lang, 'forum.listLine', {
        forumId: f.forumChannelId,
        announceId: f.announceChannelId,
        template: f.templateId,
      })
    );
    const embed = new EmbedBuilder()
      .setTitle(t(lang, 'forum.listTitle'))
      .setDescription(lines.join('\n'))
      .setColor('#5865F2');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

module.exports = { handleForumCommand };
