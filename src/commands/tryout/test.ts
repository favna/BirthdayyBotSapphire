import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import generateEmbed from '../../helpers/generate/embed';
import { isNotPrd } from '../../helpers/provide/environment';
import replyToInteraction from '../../helpers/send/response';
import { getCurrentOffset } from '../../helpers/utils/date';
import { getCommandGuilds } from '../../helpers/utils/guilds';
import thinking from '../../lib/discord/thinking';
import type { EmbedInformationModel } from '../../lib/model/EmbedInformation.model';

@ApplyOptions<Command.Options>({
	name: 'test',
	description: 'test things',
})
export class TestCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register slash command
		registry.registerChatInputCommand(
			{
				name: this.name,
				description: this.description,
			},
			{
				guildIds: getCommandGuilds('testing'),
			},
		);
	}

	// slash command
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		await thinking(interaction);
		const fields = [{ name: 'test', value: 'Test Test' }];
		const current = getCurrentOffset();
		if (!current) {
			const embed = generateEmbed({ title: 'test', description: 'No current time' });
			return replyToInteraction(interaction, { embeds: [embed] });
		}
		if (isNotPrd) await this.container.tasks.run('BirthdayReminderTask', {});
		const embedObj: EmbedInformationModel = { title: 'test', fields };
		const embed = generateEmbed(embedObj);
		return replyToInteraction(interaction, { embeds: [embed] });
	}
}
