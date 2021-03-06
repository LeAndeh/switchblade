const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerTrack extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'track'
    this.aliases = ['song', 't', 's']
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findTracks(query)
    return results.data
  }

  searchResultFormatter (item) {
    return `[${item.title_short}](${item.link}) - [${item.artist.name}](${item.artist.link})`
  }

  handleResult ({ t, channel, author }, track) {
    channel.startTyping()
    const { link, title, duration, explicit_lyrics: explicitLyric, artist, album } = track
    const explicit = explicitLyric ? Constants.EXPLICIT : ''
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.track.trackInfo'), this.embedLogoURL, link)
      .setThumbnail(album.cover_big)
      .setDescription(`${explicit} [${title}](${link}) \`(${MiscUtils.formatDuration(duration * 1000)})\``)
      .addField(t('music:artist'), `[${artist.name}](${artist.link})`, true)
      .addField(t('music:album'), `[${album.title}](https://www.deezer.com/album/${album.id})`, true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
