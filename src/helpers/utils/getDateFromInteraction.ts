import type { Command } from '@sapphire/framework';
import type { Subcommand } from '@sapphire/plugin-subcommands';
import { addZeroToSingleDigitNumber } from './string';

interface DateResult {
	isValidDate: boolean;
	date: string;
	message: string;
}

export function getDateFromInteraction(
	interaction: Command.ChatInputCommandInteraction | Subcommand.ChatInputCommandInteraction,
): DateResult {
	const result: DateResult = {
		isValidDate: false,
		date: '',
		message: 'Something went wrong while validating the date.',
	};

	const day = addZeroToSingleDigitNumber(interaction.options.getInteger('day', true));
	const month = addZeroToSingleDigitNumber(interaction.options.getString('month', true));
	const year = interaction.options.getInteger('year', false) ?? 'XXXX';

	result.isValidDate = true;
	result.message = 'The provided date is valid';
	result.date = `${year}-${month}-${day}`;
	return result;
}
