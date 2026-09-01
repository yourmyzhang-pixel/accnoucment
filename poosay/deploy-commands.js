require('dotenv').config();
const {
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('edit')
    .setDescription('Open the announcement style editor / เปิดแผงแก้ไขรูปแบบประกาศ')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  new SlashCommandBuilder()
    .setName('forum')
    .setDescription('Manage announced forums / จัดการฟอรั่มที่บอทประกาศ')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a forum / เพิ่มฟอรั่ม')
        .addChannelOption((opt) =>
          opt
            .setName('forum')
            .setDescription('Source forum channel / ช่องฟอรั่มต้นทาง')
            .addChannelTypes(ChannelType.GuildForum)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('announce')
            .setDescription('Announcement channel / ห้องประกาศ')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('template')
            .setDescription('Template to use / เทมเพลตที่จะใช้')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('name')
            .setDescription('Display name, optional / ชื่อเรียก ไม่บังคับ')
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a forum / ลบฟอรั่ม')
        .addChannelOption((opt) =>
          opt
            .setName('forum')
            .setDescription('Forum to remove / ฟอรั่มที่จะลบ')
            .addChannelTypes(ChannelType.GuildForum)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription("Change a forum's template / เปลี่ยนเทมเพลตของฟอรั่ม")
        .addChannelOption((opt) =>
          opt
            .setName('forum')
            .setDescription('Forum / ฟอรั่ม')
            .addChannelTypes(ChannelType.GuildForum)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('template')
            .setDescription('New template / เทมเพลตใหม่')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('List forums / ดูรายการฟอรั่ม')
    ),

  new SlashCommandBuilder()
    .setName('template')
    .setDescription('Manage templates / จัดการเทมเพลต')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName('new')
        .setDescription('Create a template / สร้างเทมเพลตใหม่')
        .addStringOption((opt) =>
          opt
            .setName('id')
            .setDescription('Template ID, e.g. templateA / รหัสเทมเพลต')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('del')
        .setDescription('Delete a template / ลบเทมเพลต')
        .addStringOption((opt) =>
          opt
            .setName('id')
            .setDescription('Template to delete / เทมเพลตที่จะลบ')
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),

  new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the bot language / เปลี่ยนภาษาบอท')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt
        .setName('lang')
        .setDescription('Language / ภาษา')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'ไทย (Thai)', value: 'th' }
        )
    ),
].map((c) => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (process.env.GUILD_ID) {
      console.log(`⏳ Registering commands for guild ${process.env.GUILD_ID} (test mode)...`);
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );
      console.log(
        `✅ Commands registered for guild ${process.env.GUILD_ID} only (test mode).`
      );
    } else {
      console.log('⏳ Registering global commands (works on every server)...');
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
      console.log(
        '✅ Global commands registered! Works on every server the bot is invited to ' +
          '(may take up to ~1 hour to appear everywhere the first time).'
      );
    }
  } catch (err) {
    console.error('❌ Failed to register commands:', err);
  }
})();
