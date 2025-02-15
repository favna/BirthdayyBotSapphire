import { ApplyOptions } from '@sapphire/decorators';
import { Time } from '@sapphire/duration';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ButtonInteraction, time, TimestampStyles } from 'discord.js';
import { remindMeButtonDisabled } from '../lib/components/button';
import { editInteractionResponse } from '../lib/discord/interaction';

@ApplyOptions<InteractionHandler.Options>({ interactionHandlerType: InteractionHandlerTypes.Button })
export class VoteReminderButton extends InteractionHandler {
	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'vote-reminder-button') return this.none();

		const timestampTwelveHoursLater = interaction.message.createdTimestamp + Time.Hour * 12;
		return this.some({ time: timestampTwelveHoursLater });
	}

	public async run(interaction: ButtonInteraction, result: { time: number }) {
		await interaction.deferUpdate();

		await editInteractionResponse(interaction, {
			components: [
				{
					type: 1,
					components: [remindMeButtonDisabled],
				},
			],
		});

		const delay = result.time - Date.now();

		if (delay < 0) {
			return interaction.followUp({ content: 'You can vote now already again!', ephemeral: true });
		}

		await this.container.tasks.create(
			'VoteReminderTask',
			{ memberId: interaction.user.id },
			{ repeated: false, delay },
		);
		return interaction.followUp({
			content: `I will remind you to vote ${time(
				Math.round(result.time / 1000),
				TimestampStyles.RelativeTime,
			)} !`,
			ephemeral: true,
		});
	}
}
