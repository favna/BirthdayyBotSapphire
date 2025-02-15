import { ApplyOptions } from '@sapphire/decorators';
import { type ChatInputCommandDeniedPayload, Events, Listener, UserError } from '@sapphire/framework';
import { reply } from '../../../../helpers/send/response';

@ApplyOptions<Listener.Options>({ event: Events.ChatInputCommandDenied })
export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
	public async run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		return reply(interaction, {
			content,
			allowedMentions: { users: [interaction.user.id], roles: [] },
			ephemeral: true,
		});
	}
}
