const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerUser extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'user'
    this.aliases = ['u']
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findUser(query)
    return results.data
  }

  searchResultFormatter (item) {
    return `[${item.name}](https://www.deezer.com/profile/${item.id})`
  }

  async handleResult ({ t, channel, author, language }, user) {
    channel.startTyping()
    const { name, picture_big: cover, id } = user
    const link = `https://www.deezer.com/profile/${id}`
    const followers = await this.client.apis.deezer.getUserFollowers(id)
    const followings = await this.client.apis.deezer.getUserFollowings(id)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.user.userInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setTitle(name)
      .setURL(link)
      .addField(t('commands:deezer.followers'), MiscUtils.formatNumber(followers.total, language), true)
      .addField(t('commands:deezer.following'), MiscUtils.formatNumber(followings.total, language), true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
