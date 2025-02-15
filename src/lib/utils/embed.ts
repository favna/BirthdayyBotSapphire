import type { APIEmbed, BaseMessageOptions, InteractionReplyOptions } from 'discord.js';
import {
	ARROW_RIGHT,
	BOT_AVATAR,
	BOT_COLOR,
	BOT_NAME,
	FAIL,
	IS_CUSTOM_BOT,
	SUCCESS,
} from '../../helpers/provide/environment';

type UniversalMessageOptions = Omit<BaseMessageOptions, 'flags'>;
type UniversalInteractionOptions = Omit<InteractionReplyOptions, 'flags'>;

export function generateDefaultEmbed(embed: APIEmbed): APIEmbed {
	return {
		...defaultEmbed(),
		...embed,
	};
}

export function defaultEmbed(): APIEmbed {
	return {
		color: BOT_COLOR,
		timestamp: new Date().toISOString(),
		footer: {
			text: `${BOT_NAME} ${IS_CUSTOM_BOT ? '👑' : ''}`,
			icon_url: BOT_AVATAR,
		},
	};
}

export type APIEmbedWithoutDefault = Omit<APIEmbed, 'timestamp' | 'footer'>;

export function success(description: string): APIEmbed {
	return {
		...defaultEmbed(),
		title: `${SUCCESS} Success`,
		description: `${ARROW_RIGHT} ${description}`,
	};
}

export function messageSuccess(message: string): UniversalMessageOptions {
	return {
		content: '',
		embeds: [success(message)],
		components: [],
	};
}

export function interactionSuccess(message: string, ephemeral = true): UniversalInteractionOptions {
	return {
		content: '',
		embeds: [success(message)],
		components: [],
		ephemeral,
	};
}

export function problem(description: string): APIEmbed {
	return {
		...defaultEmbed(),
		title: `${FAIL} Failure`,
		description: `${ARROW_RIGHT} ${description}`,
	};
}

export function messageProblem(message: string): UniversalMessageOptions {
	return {
		content: '',
		embeds: [problem(message)],
		components: [],
	};
}

export function interactionProblem(message: string, ephemeral = true): UniversalInteractionOptions {
	return {
		content: '',
		embeds: [problem(message)],
		components: [],
		ephemeral,
	};
}
