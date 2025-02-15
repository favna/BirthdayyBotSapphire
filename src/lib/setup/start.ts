// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sentry/tracing';
import '@sapphire/plugin-hmr/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-subcommands/register';
import '@kaname-png/plugin-subcommands-advanced/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-scheduled-tasks/register';
import '@sapphire/plugin-utilities-store/register';
import '@devtomio/plugin-botlist/register';

import * as colorette from 'colorette';
import { inspect } from 'util';
import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
