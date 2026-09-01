const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} = require('discord.js');
const { loadConfig, saveConfig, getGuildConfig } = require('../utils/configStore');
const { t } = require('../utils/i18n');

function buildTemplateSelectRow(guildConfig, lang) {
  const options = Object.keys(guildConfig.templates).map((id) => ({
    label: id,
    value: id,
  }));
  const menu = new StringSelectMenuBuilder()
    .setCustomId('edit_select_template')
    .setPlaceholder(t(lang, 'edit.selectPlaceholder'))
    .addOptions(options);
  return new ActionRowBuilder().addComponents(menu);
}

function buildEditButtonsRow(templateId, lang) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`edit_basic::${templateId}`)
      .setLabel(t(lang, 'edit.buttonBasic'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`edit_author::${templateId}`)
      .setLabel(t(lang, 'edit.buttonAuthor'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`edit_footer::${templateId}`)
      .setLabel(t(lang, 'edit.buttonFooter'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`edit_image::${templateId}`)
      .setLabel(t(lang, 'edit.buttonImage'))
      .setStyle(ButtonStyle.Secondary)
  );
}

// /edit -> แสดงรายการเทมเพลต "ของเซิร์ฟเวอร์นี้เท่านั้น" ให้เลือกก่อน
async function handleSlashEdit(interaction) {
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';
  const templateIds = Object.keys(guildConfig.templates || {});
  if (templateIds.length === 0) {
    return interaction.reply({ content: t(lang, 'edit.noTemplates'), flags: MessageFlags.Ephemeral });
  }
  await interaction.reply({
    content: t(lang, 'edit.selectPrompt'),
    components: [buildTemplateSelectRow(guildConfig, lang)],
    flags: MessageFlags.Ephemeral,
  });
}

// เลือกเทมเพลตแล้ว -> โชว์ปุ่ม 4 อัน
async function handleSelectTemplate(interaction) {
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';
  const templateId = interaction.values[0];
  await interaction.update({
    content: t(lang, 'edit.editingHeader', { id: templateId }),
    components: [buildEditButtonsRow(templateId, lang)],
  });
}

// กดปุ่ม -> เปิดฟอร์ม (modal) ให้กรอก (อ่านค่าปัจจุบันจากเทมเพลตของเซิร์ฟเวอร์นี้)
async function handleEditButton(interaction) {
  const [action, templateId] = interaction.customId.split('::');
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';
  const template = guildConfig.templates[templateId];
  if (!template) {
    return interaction.reply({ content: t(lang, 'edit.notFound'), flags: MessageFlags.Ephemeral });
  }

  if (action === 'edit_basic') {
    const modal = new ModalBuilder()
      .setCustomId(`modal_basic::${templateId}`)
      .setTitle(t(lang, 'edit.modalBasicTitle'));

    const titleInput = new TextInputBuilder()
      .setCustomId('title')
      .setLabel(t(lang, 'edit.fieldTitle'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.title || '')
      .setRequired(false);

    const descInput = new TextInputBuilder()
      .setCustomId('description')
      .setLabel(t(lang, 'edit.fieldDescription'))
      .setStyle(TextInputStyle.Paragraph)
      .setValue(template.description || '')
      .setRequired(false);

    const colorInput = new TextInputBuilder()
      .setCustomId('color')
      .setLabel(t(lang, 'edit.fieldColor'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.color || '#5865F2')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(descInput),
      new ActionRowBuilder().addComponents(colorInput)
    );
    return interaction.showModal(modal);
  }

  if (action === 'edit_author') {
    const modal = new ModalBuilder()
      .setCustomId(`modal_author::${templateId}`)
      .setTitle(t(lang, 'edit.modalAuthorTitle'));

    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel(t(lang, 'edit.fieldAuthorName'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.author?.name || '')
      .setRequired(false);

    const iconInput = new TextInputBuilder()
      .setCustomId('iconUrl')
      .setLabel(t(lang, 'edit.fieldIconUrl'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.author?.iconUrl || '')
      .setRequired(false);

    const urlInput = new TextInputBuilder()
      .setCustomId('url')
      .setLabel(t(lang, 'edit.fieldLinkUrl'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.author?.url || '')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nameInput),
      new ActionRowBuilder().addComponents(iconInput),
      new ActionRowBuilder().addComponents(urlInput)
    );
    return interaction.showModal(modal);
  }

  if (action === 'edit_footer') {
    const modal = new ModalBuilder()
      .setCustomId(`modal_footer::${templateId}`)
      .setTitle(t(lang, 'edit.modalFooterTitle'));

    const textInput = new TextInputBuilder()
      .setCustomId('text')
      .setLabel(t(lang, 'edit.fieldFooterText'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.footer?.text || '')
      .setRequired(false);

    const iconInput = new TextInputBuilder()
      .setCustomId('iconUrl')
      .setLabel(t(lang, 'edit.fieldIconUrl'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.footer?.iconUrl || '')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(textInput),
      new ActionRowBuilder().addComponents(iconInput)
    );
    return interaction.showModal(modal);
  }

  if (action === 'edit_image') {
    const modal = new ModalBuilder()
      .setCustomId(`modal_image::${templateId}`)
      .setTitle(t(lang, 'edit.modalImageTitle'));

    const cropInput = new TextInputBuilder()
      .setCustomId('cropSquare')
      .setLabel(t(lang, 'edit.fieldCropSquare'))
      .setStyle(TextInputStyle.Short)
      .setValue(template.image?.cropSquare ? 'yes' : 'no')
      .setRequired(false);

    const blurInput = new TextInputBuilder()
      .setCustomId('blur')
      .setLabel(t(lang, 'edit.fieldBlur'))
      .setStyle(TextInputStyle.Short)
      .setValue(String(template.image?.blur ?? 0))
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(cropInput),
      new ActionRowBuilder().addComponents(blurInput)
    );
    return interaction.showModal(modal);
  }
}

// กรอก modal เสร็จแล้ว -> บันทึกลงเทมเพลตของเซิร์ฟเวอร์นี้ใน config.json
async function handleModalSubmit(interaction) {
  const [action, templateId] = interaction.customId.split('::');
  const config = loadConfig();
  const guildConfig = getGuildConfig(config, interaction.guildId);
  const lang = guildConfig.lang || 'en';
  const template = guildConfig.templates[templateId];
  if (!template) {
    return interaction.reply({ content: t(lang, 'edit.notFound'), flags: MessageFlags.Ephemeral });
  }

  if (action === 'modal_basic') {
    template.title = interaction.fields.getTextInputValue('title');
    template.description = interaction.fields.getTextInputValue('description');
    template.color = interaction.fields.getTextInputValue('color') || '#5865F2';
  } else if (action === 'modal_author') {
    template.author = {
      name: interaction.fields.getTextInputValue('name'),
      iconUrl: interaction.fields.getTextInputValue('iconUrl'),
      url: interaction.fields.getTextInputValue('url'),
    };
  } else if (action === 'modal_footer') {
    template.footer = {
      text: interaction.fields.getTextInputValue('text'),
      iconUrl: interaction.fields.getTextInputValue('iconUrl'),
    };
  } else if (action === 'modal_image') {
    const cropRaw = interaction.fields
      .getTextInputValue('cropSquare')
      .trim()
      .toLowerCase();
    const blurRaw = interaction.fields.getTextInputValue('blur').trim();
    template.image = {
      cropSquare: ['yes', 'y', 'true', 'ใช่'].includes(cropRaw),
      blur: Math.max(0, Number(blurRaw) || 0),
    };
  }

  guildConfig.templates[templateId] = template;
  saveConfig(config);

  await interaction.reply({ content: t(lang, 'edit.saved', { id: templateId }), flags: MessageFlags.Ephemeral });
}

module.exports = {
  handleSlashEdit,
  handleSelectTemplate,
  handleEditButton,
  handleModalSubmit,
};
