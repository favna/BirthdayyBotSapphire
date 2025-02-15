import { ApplyOptions } from '@sapphire/decorators';
import { container, Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { DurationFormatter } from '@sapphire/time-utilities';
import { Guild, time } from 'discord.js';
import { BOT_NAME, BOT_SERVER_LOG, DEBUG, FAIL } from '../../../helpers';
import { sendMessage } from '../../../lib/discord';
import { BotColorEnum } from '../../../lib/enum/BotColor.enum';
import type { EmbedInformationModel } from '../../../lib/model';
import { generateDefaultEmbed } from '../../../lib/utils/embed';

@ApplyOptions<ListenerOptions>({ event: Events.GuildDelete })
export class UserEvent extends Listener<typeof Events.GuildDelete> {
	public async run(guild: Guild) {
		const guild_id = guild.id;

		if (!container.client.isReady()) return;

		this.container.logger.debug(`[EVENT] ${Events.GuildDelete} - ${guild.name} (${guild_id})`);
		DEBUG ? container.logger.debug(`[GuildDelete] - ${guild.toString()}`) : null;

		await this.leaveServerLog(guild);
		await container.utilities.guild.update.DisableGuildAndBirthdays(guild_id, true);
	}

	private async leaveServerLog(guild: Guild) {
		container.logger.info('Removed from Guild');
		const { id: guild_id, name, description, memberCount, ownerId, joinedTimestamp: rawJoinedTimestamp } = guild;
		const joinedAgo = time(Math.floor(rawJoinedTimestamp / 1000), 'f');
		const joinedDate = time(Math.floor(rawJoinedTimestamp / 1000), 'R');
		const timeServed = new DurationFormatter().format(Date.now() - rawJoinedTimestamp);
		const fields = [
			{ name: 'GuildName', value: `${name}` },
			{
				name: 'GuildID',
				value: `${guild_id}`,
			},
		];

		if (description) fields.push({ name: 'GuildDescription', value: `${description}` });
		if (memberCount) fields.push({ name: 'GuildMemberCount', value: `${memberCount}` });
		if (ownerId) fields.push({ name: 'GuildOwnerID', value: `${ownerId}` });
		if (rawJoinedTimestamp) fields.push({ name: 'GuildJoinedTimestamp', value: `${joinedDate}\n${joinedAgo}` });
		if (timeServed) fields.push({ name: 'TimeServed', value: `${timeServed}` });
		const embedObj: EmbedInformationModel = {
			title: `${FAIL} ${BOT_NAME} got removed from a Guild`,
			description: `I am now in \`${await this.container.botList.computeGuilds()}\` guilds`,
			fields,
			color: BotColorEnum.BIRTHDAYY_DEV,
		};

		const embed = generateDefaultEmbed(embedObj);
		await sendMessage(BOT_SERVER_LOG, { embeds: [embed] });
	}
}
