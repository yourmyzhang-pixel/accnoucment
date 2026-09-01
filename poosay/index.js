require('dotenv').config();

// เปิด keep-alive server เฉพาะเมื่อตั้งค่า ENABLE_KEEPALIVE=true ใน .env
// (ใช้ตอน deploy บน Replit/Glitch เพื่อกันโปรเจกต์หลับ ไม่จำเป็นถ้ารันบน VPS เอง)
if (process.env.ENABLE_KEEPALIVE === 'true') {
  const { startKeepAliveServer } = require('./keepAlive');
  startKeepAliveServer();
}

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AttachmentBuilder,
  ChannelType,
  MessageFlags,
} = require('discord.js');

const { loadConfig } = require('./utils/configStore');
const { processImage } = require('./utils/imageProcessor');
const {
  handleSlashEdit,
  handleSelectTemplate,
  handleEditButton,
  handleModalSubmit,
} = require('./interactions/editPanel');
const { handleForumCommand } = require('./interactions/forumManager');
const { handleTemplateCommand } = require('./interactions/templateManager');
const { handleLanguageCommand } = require('./interactions/language');
const { handleTemplateAutocomplete } = require('./utils/templateAutocomplete');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.ThreadMember],
});

client.once('ready', () => {
  console.log(`✅ เข้าสู่ระบบสำเร็จในชื่อ ${client.user.tag}`);
});

function isImageAttachment(attachment) {
  if (attachment.contentType && attachment.contentType.startsWith('image/')) {
    return true;
  }
  return /\.(png|jpe?g|gif|webp)$/i.test(attachment.name || '');
}

function buildMention(template) {
  if (template.mentionType === 'everyone') {
    return { content: '@everyone', allowedMentions: { parse: ['everyone'] } };
  }
  if (template.mentionType === 'here') {
    return { content: '@here', allowedMentions: { parse: ['everyone'] } };
  }
  if (template.mentionType === 'role' && template.roleId) {
    return {
      content: `<@&${template.roleId}>`,
      allowedMentions: { roles: [template.roleId] },
    };
  }
  return { content: undefined, allowedMentions: { parse: [] } };
}

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (!message.channel.isThread()) return;

    const parent = message.channel.parent;
    // รองรับฟอรั่มที่ตั้งเป็น Age-Restricted (NSFW) ปกติ เพราะ type ยังเป็น GuildForum เหมือนเดิม
    if (!parent || parent.type !== ChannelType.GuildForum) return;

    const config = loadConfig();
    const guildConfig = config.guilds[message.guild.id];
    if (!guildConfig) return; // เซิร์ฟเวอร์นี้ยังไม่เคยตั้งค่าฟอรั่มใดๆ เลย

    const forumEntry = guildConfig.forums.find(
      (f) => f.forumChannelId === parent.id
    );
    if (!forumEntry) return;

    const template = guildConfig.templates[forumEntry.templateId];
    if (!template) {
      console.warn(`⚠️ ไม่พบเทมเพลต "${forumEntry.templateId}" สำหรับฟอรั่มนี้`);
      return;
    }

    if (guildConfig.onlyImages !== false) {
      const images = [...message.attachments.values()].filter(
        isImageAttachment
      );
      if (images.length === 0) return;

      const announceChannel = await client.channels
        .fetch(forumEntry.announceChannelId)
        .catch(() => null);
      if (!announceChannel) {
        console.warn(
          `⚠️ ไม่พบห้องประกาศ ID: ${forumEntry.announceChannelId}`
        );
        return;
      }

      const { content, allowedMentions } = buildMention(template);
      const threadUrl = `https://discord.com/channels/${message.guild.id}/${message.channel.id}`;

      // ส่งภาพมากี่รูป แยกประกาศเป็นรายรูป
      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        let processedBuffer;
        try {
          processedBuffer = await processImage(img.url, template.image || {});
        } catch (imgErr) {
          console.error('ประมวลผลรูปภาพไม่สำเร็จ ใช้รูปต้นฉบับแทน:', imgErr);
        }

        const description = (template.description || '')
          .replaceAll('{threadName}', message.channel.name)
          .replaceAll('{author}', `<@${message.author.id}>`);

        const embed = new EmbedBuilder()
          .setTitle(template.title || '')
          .setDescription(description)
          .setColor(template.color || '#5865F2')
          .setTimestamp();

        if (template.author?.name) {
          embed.setAuthor({
            name: template.author.name,
            iconURL: template.author.iconUrl || undefined,
            url: template.author.url || undefined,
          });
        }

        if (template.footer?.text) {
          embed.setFooter({
            text: template.footer.text,
            iconURL: template.footer.iconUrl || undefined,
          });
        }

        if (template.includeThreadLink) {
          embed.addFields({ name: 'ลิงก์กระทู้', value: threadUrl });
        }

        const sendOptions = {
          content,
          embeds: [embed],
          allowedMentions,
        };

        if (processedBuffer) {
          const fileName = `image-${i}.jpg`;
          const attachment = new AttachmentBuilder(processedBuffer, {
            name: fileName,
          });
          embed.setImage(`attachment://${fileName}`);
          sendOptions.files = [attachment];
        } else {
          // สำรอง: ถ้าประมวลผลรูปไม่สำเร็จ ให้ใช้ลิงก์รูปต้นฉบับแทน
          embed.setImage(img.url);
        }

        await announceChannel.send(sendOptions);
      }
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาดตอนประมวลผลข้อความ:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (
      interaction.isAutocomplete() &&
      (interaction.commandName === 'forum' || interaction.commandName === 'template')
    ) {
      return handleTemplateAutocomplete(interaction);
    }
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'edit') return handleSlashEdit(interaction);
      if (interaction.commandName === 'forum') return handleForumCommand(interaction);
      if (interaction.commandName === 'template') return handleTemplateCommand(interaction);
      if (interaction.commandName === 'language') return handleLanguageCommand(interaction);
    }
    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === 'edit_select_template'
    ) {
      return handleSelectTemplate(interaction);
    }
    if (interaction.isButton() && interaction.customId.startsWith('edit_')) {
      return handleEditButton(interaction);
    }
    if (
      interaction.isModalSubmit() &&
      interaction.customId.startsWith('modal_')
    ) {
      return handleModalSubmit(interaction);
    }
  } catch (err) {
    console.error('interactionCreate error:', err);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction
        .reply({ content: 'Something went wrong / เกิดข้อผิดพลาด', flags: MessageFlags.Ephemeral })
        .catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
