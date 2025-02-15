import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { getCommandGuilds } from '../../helpers/utils/guilds';

@ApplyOptions<Command.Options>({
	description: 'ping pong',
})
export class PingCommand extends Command {
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
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });
		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - interaction.createdTimestamp
		}ms.`;

		return interaction.editReply({
			content,
		});
	}
}
