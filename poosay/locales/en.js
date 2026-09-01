module.exports = {
  language: {
    changed: '✅ Language set to English.',
  },
  forum: {
    templateNotFound:
      'Template "{id}" not found in this server. Create it first with `/template new`.',
    alreadyAdded:
      'This forum is already added (using template "{id}"). Use `/forum set` to change it.',
    added:
      '✅ Added forum **{name}**\n- Forum: <#{forumId}>\n- Announces to: <#{announceId}>\n- Template: **{template}**',
    notInList: 'This forum was not found in the list.',
    removed: '🗑️ Removed <#{forumId}> from the list.',
    setDone: '✅ <#{forumId}> now uses template **{template}**.',
    notAddedYet: "This forum hasn't been added yet. Use `/forum add` first.",
    listEmpty: 'No forums set up yet. Try `/forum add`.',
    listTitle: 'Forums in this server',
    listLine:
      '• <#{forumId}> → announces to <#{announceId}> (template: **{template}**)',
  },
  template: {
    invalidId: 'Template ID can only contain letters, numbers, - and _.',
    alreadyExists: 'A template named "{id}" already exists in this server.',
    created:
      '✅ Created template **{id}** (default values). Use `/edit` to customize it.',
    notFound: 'Template "{id}" not found in this server.',
    inUse:
      "❌ Can't delete — template **{id}** is still used by: {forums}\nChange those forums to another template first with `/forum set` (or `/forum remove`), then try again.",
    deleted: '🗑️ Deleted template **{id}**.',
    defaultTitle: '📢 New image in the forum!',
    defaultDescription: 'A new image was posted in **{threadName}**\nby {author}',
  },
  edit: {
    selectPlaceholder: 'Select a template to edit',
    noTemplates: 'This server has no templates yet. Create one first with `/template new`.',
    selectPrompt: 'Select a template to edit:',
    editingHeader: 'Editing template: **{id}**\nChoose what to edit:',
    buttonBasic: 'Basic info',
    buttonAuthor: 'Author',
    buttonFooter: 'Footer',
    buttonImage: 'Image',
    modalBasicTitle: 'Edit basic info',
    fieldTitle: 'Title',
    fieldDescription: 'Description (use {threadName} {author})',
    fieldColor: 'Color (hex, e.g. #00B0F4)',
    modalAuthorTitle: 'Edit author',
    fieldAuthorName: 'Author name',
    fieldIconUrl: 'Icon URL',
    fieldLinkUrl: 'Link URL',
    modalFooterTitle: 'Edit footer',
    fieldFooterText: 'Footer text',
    modalImageTitle: 'Edit image settings',
    fieldCropSquare: 'Crop to 1:1? (yes/no)',
    fieldBlur: 'Blur amount (0 = none, try 0-20)',
    notFound: 'This template no longer exists.',
    saved: '✅ Saved template **{id}**.',
  },
};
