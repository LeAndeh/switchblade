const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter, CommandRequirements } = CommandStructures

const types = ['user', 'u', 'repository', 'repo', 'organization', 'org']

module.exports = class GitHub extends Command {
  constructor (client) {
    super(client)

    this.name = 'github'
    this.aliases = ['gh']
    this.requirements = new CommandRequirements(this, { apis: ['github'] })

    this.GITHUB_LOGO = 'https://i.imgur.com/gsY6oYB.png'

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: false,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['user', 'repository', 'organization'].join('`, `')}\``
            ].join('\n'))
        }
      })
    )
  }
}
