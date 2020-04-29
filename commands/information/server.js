/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ahallain <ahallain@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2020/04/23 08:11:44 by ahallain          #+#    #+#             */
/*   Updated: 2020/04/25 05:01:00 by ahallain         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const MessageEmbed = require('discord.js').MessageEmbed;
const utils = require('../../utils.js');

module.exports = {
	name: 'server',
	aliases: ['guild'],
	description: 'Display information on a server.',
	privateMessage: false,
	message: async message => {
		const guilds = [];
		for (const arg of message.args) {
			const guild = message.client.guilds.cache.get(arg);
			if (guild)
				guilds.push(guild);
		}
		if (!guilds.length)
			guilds.push(message.guild);
		for (const cacheGuild of guilds) {
			const embed = new MessageEmbed();
			const guild = await cacheGuild.fetch();
			embed.setTitle('Server');
			embed.setThumbnail(guild.iconURL({
				dynamic: true,
				size: 4096
			}));
			embed.setImage(guild.splashURL({
				dynamic: true,
				size: 4096
			}));
			embed.addField('Id', guild.id);
			embed.addField('Name', guild.name, true);
			embed.addField('Acronym', guild.nameAcronym, true);
			if (guild.description)
				embed.addField('Description', guild.description);
			embed.addField('Owner', guild.owner);
			embed.addField('Region', guild.region, true);
			embed.addField('CreatedAt', guild.createdAt.toGMTString(), true);
			embed.addField('\u200B', '\u200B');
			if (guild.features.length)
				embed.addField('Features', `\`${guild.features.join('`,\n`')}\``);
			if (guild.applicationID)
				embed.addField('ApplicationID', guild.applicationID);
			if (guild.afkChannel) {
				embed.addField('AfkChannel', guild.afkChannel);
				embed.addField('AfkTimeout', guild.afkTimeout);
			}
			if (embed.fields[embed.fields.length - 1].name != '\u200B')
				embed.addField('\u200B', '\u200B');
			embed.addField('DefaultMessageNotifications', guild.defaultMessageNotifications, true);
			embed.addField('VerificationLevel', guild.verificationLevel, true);
			embed.addField('ExplicitContentFilter', guild.explicitContentFilter, true);
			embed.addField('\u200B', '\u200B');
			if (guild.premiumTier) {
				embed.addField('PremiumTier', guild.premiumTier, true);
				embed.addField('PremiumSubscriptionCount', guild.premiumSubscriptionCount, true);
				embed.addField('\u200B', '\u200B');
			}
			embed.addField('MemberCount', guild.memberCount, true);
			embed.addField('MaximumMembers', guild.maximumMembers, true);
			embed.addField('Emojis', Array.from(guild.emojis.cache.values()).length);
			embed.addField('Channels', Array.from(guild.channels.cache.keys()).length);
			embed.addField('Roles', Array.from(guild.roles.cache.values()).length);
			utils.sendEmbed(message.channel, message.dictionary, embed);
			const banner = guild.bannerURL({
				dynamic: true,
				size: 4096
			});
			if (banner)
				utils.sendEmbed(message.channel, message.dictionary, new MessageEmbed()
					.setTitle('BannerURL')
					.setImage(banner));
		}
	}
};