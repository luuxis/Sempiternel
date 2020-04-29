/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   help.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ahallain <ahallain@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2020/04/20 11:09:57 by ahallain          #+#    #+#             */
/*   Updated: 2020/04/28 15:42:06 by ahallain         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const MessageEmbed = require('discord.js').MessageEmbed;
const utils = require(`../../utils.js`);

module.exports = {
	name: 'help',
	aliases: ['h'],
	description: 'Get a list of commands or information about a particular command.',
	message: message => {
		let embed;
		if (message.args.length) {
			let category;
			let command = message.args[0].toLowerCase();
			for (const category of Object.keys(message.client._commands)) {
				for (const commandFile of message.client._commands[category])
					if (commandFile.name == command
						|| commandFile.aliases.includes(command)) {
						command = commandFile;
						break;
					}
				if (typeof command == 'object')
					break;
			}
			if (typeof command == 'string') {
				utils.sendMessage(message.channel, message.dictionary, 'error_command_not_found', {
					'<command>': command,
					'<prefix>': message.prefix
				});
				return;
			}
			embed = new MessageEmbed();
			for (const key of Object.keys(command)) {
				const name = key.charAt(0).toUpperCase() + key.slice(1);
				let message = '';
				if (typeof command[key] == 'string'
					|| typeof command[key] == 'boolean')
					message = `${command[key]}`;
				else if (typeof command[key] == 'object')
					for (const value of Object.values(command[key])) {
						if (message.length)
							message += ', ';
						message += `\`${value}\``;
					}
				else
					continue;
				if (message != '')
					embed.addField(name, message);
			}
		} else {
			embed = utils.getEmbed(message.dictionary, 'help_desciption', {
				'<prefix>': message.prefix
			});
			for (const category of Object.keys(message.client._commands)) {
				let commands = '';
				for (const command of message.client._commands[category]) {
					if (commands.length)
						commands += ',\n';
					commands += `\`${command.name}\``;
				}
				embed.addField(category.charAt(0).toUpperCase() + category.slice(1), commands);
			}
		}
		embed.setTitle('Help');
		utils.sendEmbed(message.channel, message.dictionary, embed);
	}
};