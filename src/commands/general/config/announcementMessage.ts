import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { EmbedLimits } from '@sapphire/discord.js-utilities';
import { PREMIUM_URL, reply } from '../../../helpers';
import thinking from '../../../lib/discord/thinking';
import { interactionProblem, interactionSuccess } from '../../../lib/utils/embed';

@RegisterSubCommand('config', (builder) =>
	builder
		.setName('announcement-message')
		.setDescription('Add a custom birthday announcement message.')
		.addStringOption((option) =>
			option
				.setName('message')
				.setDescription('{MENTION}, {USERNAME}, {DISCRIMINATOR}, {NEW_LINE}, {SERVERNAME}')
				.setRequired(true),
		),
)
export class AnnouncementMessageCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction<'cached'>) {
		await thinking(interaction);

		const message = interaction.options.getString('message', true);
		const isPremium = await this.container.utilities.guild.check.isGuildPremium(interaction.guildId);

		if (!isPremium) {
			return reply(
				interaction,
				interactionProblem(`This feature is currently in __Beta Stage__ and **Birthdayy Premium Only**.
				If you are interested in using this and future features now already, you can support the Development on [Patreon](${PREMIUM_URL}).`),
			);
		}

		if (message.length > EmbedLimits.MaximumDescriptionLength - 500) {
			return reply(
				interaction,
				interactionProblem('The message you provided is too long. Please try again with a shorter message.'),
			);
		}
		this.container.logger.info('MESSAGE: ', message);
		try {
			await this.container.utilities.guild.set.AnnouncementMessage(interaction.guildId, message);
			return reply(interaction, interactionSuccess('You have successfully updated the announcement message.'));
		} catch (error) {
			this.container.logger.info('AnnouncementMessageCommand ~ overridechatInputRun ~ error:', error);
			return reply(
				interaction,
				interactionProblem('An error occurred while trying to update the config. Please try again later.'),
			);
		}

		/* 		const result = await Result.fromAsync(async () =>
			this.container.utilities.guild.set.AnnouncementMessage(interaction.guildId, message),
		);

		if (result.isErr()) {
			result.unwrapOrElse((error) => {
				this.container.logger.error('AnnouncementMessageCommand ~ result.unwrapOrElse ~ error:', error);
			});
			return reply(
				interaction,
				interactionProblem('An error occurred while trying to update the config. Please try again later.'),
				);
			}
			return reply(interaction, interactionSuccess('You have successfully updated the announcement message.')); */
	}
}
