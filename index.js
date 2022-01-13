/* eslint-disable multiline-comment-style */
import React from 'react';
import react from '@vizality/react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { user } from '@vizality/discord';
import { getModule } from '@vizality/webpack';
const { object: { isEmptyObject }, react: { findInReactTree, findInTree } } = require('@vizality/util');

import DynamicAnimatedAvatar from './components/DynamicAnimatedAvatar';

import getColor from './api/getColor';
import Style from './modules/Style';
import TempPatch from './modules/TempPatch';
import patchModalLazy from './modules/patchModalLazy';

import { DefaultSettings } from './constants';

const RoleIcon = getModule(m => m.displayName === 'RoleIcon');

const { getChannel } = getModule(m => m.getChannel && m.hasChannel);
const { useRoleIcon } = getModule(m => m.useRoleIcon);
const { getGuild } = getModule(m => m.getGuild);
const { getGuildId } = getModule(m => m.getGuildId && m.getLastSelectedGuildId);

const { roleIcon, membersGroup } = getModule('membersGroup');
const { nameTag, canCopy } = getModule('nameTag', 'canCopy');
const { headerTag } = getModule('headerTag');

export default class RoleColors extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    // Chat
    // Replied Message Border
    patch(getModule(m => m.default?.displayName === 'RepliedMessage'), 'default', (args, res) => {
      if (!this.settings.get('RepliedMessageBorder', DefaultSettings.RepliedMessageBorder)) return res;

      const color = args[0].repliedAuthor?.colorString;
      if (!color) return res;

      res.props.className += ' coloredRepliedMessage';
      Style(res, color);

      return res;
    });
    // Bot Tag
    patch(getModule(m => String(m.default).includes('e.userOverride')), 'default', (args, res) => {
      if (!this.settings.get('BotTag', DefaultSettings.BotTag)) return res;

      const color = args[0].author.colorString;
      if (!color) return res;

      const BotTag = findInReactTree(res, m => m.type?.displayName === 'BotTag');
      if (BotTag) BotTag.props.color = color;

      return res;
    });
    // Timestamp
    patch(getModule(m => String(m.default).includes('e.childrenRepliedMessage')), 'default', args => {
      if (!this.settings.get('Timestamp', DefaultSettings.Timestamp)) return;

      const color = args[0].childrenHeader?.props.author?.colorString;
      if (!color) return;

      args[0].style = {
        ...args[0].style,
        '--color': color
      };
    }, 'before');
    patch(getModule(m => m.default?.displayName === 'MessageTimestamp'), 'default', (args, res) => {
      if (!this.settings.get('Timestamp', DefaultSettings.Timestamp)) return res;

      Style(res, 'var(--color)');

      return res;
    });
    // Message
    patch(getModule(m => m.type?.displayName === 'MessageContent'), 'type', (args, res) => {
      if (!this.settings.get('Message', DefaultSettings.Message)) return res;

      const { message } = args[0];
      const channel = getChannel(message.channel_id);
      if (!channel) return res;

      const color = getColor(channel.guild_id, message.author.id);
      if (!color) return res;

      Style(res, color);

      return res;
    });

    // Mention
    // User Mention
    patch(getModule(m => m.default?.displayName === 'UserMention'), 'default', (args, res) => {
      if (!this.settings.get('Mention', DefaultSettings.Mention) && !this.settings.get('UserMentionAvatar', DefaultSettings.UserMentionAvatar)) return res;

      const { channelId, userId } = args[0];

      TempPatch(res.props, 'children', (_Children, Args) => {
        Args.channelId = channelId;
        Args.userId = userId;
      }, true);

      return res;
    });
    // Role Mention
    patch(getModule(m => m.default?.displayName === 'RoleMention'), 'default', args => {
      if (!this.settings.get('RoleMentionIcon', DefaultSettings.RoleMentionIcon)) return;

      const { guildId, roleId } = args[0];

      const _RoleIcon = useRoleIcon({ roleId, guildId, size: 21 });
      if (_RoleIcon) {
        _RoleIcon.name = null;
        args[0].children[0] = args[0].children[0].substr(1);
        args[0].children.unshift(<RoleIcon className={`${roleIcon} RC-RoleIcon`} {..._RoleIcon} />);
      }
    }, 'before');
    // Mention
    patch(getModule(m => m.default?.displayName === 'Mention'), 'default', args => {
      if (!this.settings.get('Mention', DefaultSettings.Mention) && !this.settings.get('UserMentionAvatar', DefaultSettings.UserMentionAvatar)) return;

      const { className, channelId, userId, children } = args[0];
      if (className !== 'mention' || !userId) return;
      const channel = getChannel(channelId);
      const guildId = channel?.guild_id;

      if (this.settings.get('UserMentionAvatar', DefaultSettings.UserMentionAvatar)) {
        if (children.type?.displayName !== 'UserMentionAvatar') {
          args[0].children = <DynamicAnimatedAvatar guildId={guildId} userId={userId}>{children}</DynamicAnimatedAvatar>;
          DynamicAnimatedAvatar.displayName = 'UserMentionAvatar';
        }
      }

      if (this.settings.get('Mention', DefaultSettings.Mention)) {
        if (!guildId) return;
        const color = getColor(guildId, userId);
        if (!color) return;

        args[0].color = parseInt(color.replace('#', ''), 16);
      }
    }, 'before');

    // Typing Users
    patch(getModule(m => m.displayName === 'FluxContainer(TypingUsers)').prototype.render.call({ memoizedGetStateFromStores: () => void 0 }).type.prototype, 'render', (args, res, _this) => {
      if (!res || !this.settings.get('Typing', DefaultSettings.Typing)) return res;

      const { typingUsers, guildId } = _this.props;
      if (isEmptyObject(typingUsers)) return res;

      res.props.children[1].props.children.filter?.(child => child.props).forEach((child, index) => {
        const userId = Object.keys(typingUsers)[index];

        const color = getColor(guildId, userId);
        if (!color) return;

        Style(child, color);
      });

      return res;
    });

    // MemberList
    // Sections
    patch(getModule(m => m.default?.displayName === 'ListSectionItem'), 'default', (args, res) => {
      if (args[0].className !== membersGroup || !this.settings.get('MLSection', DefaultSettings.MLSection)) return res;
      const [ name ] = args[0].children?.[1].props?.children ?? [ null ];
      if (!name) return res;

      const color = Object.values(getGuild(getGuildId()).roles).find(role => role.name === name)?.colorString;
      if (!color) return res;

      Style(res, color);

      return res;
    });
    // User Activity
    patch(getModule(m => m.displayName === 'MemberListItem').prototype, 'renderActivity', (args, res, _this) => {
      if (!this.settings.get('MLUserActivity', DefaultSettings.MLUserActivity)) return res;

      const { guildId, user: { id: userId } } = _this.props;

      const color = getColor(guildId, userId);
      if (!color) return res;

      res.props.color = color;

      return res;
    });
    patch(getModule(m => m.default?.displayName === 'ActivityStatus'), 'default', (args, res) => {
      if (!res || !this.settings.get('MLUserActivity', DefaultSettings.MLUserActivity)) return res;

      const { color } = args[0];
      if (!color) return res;

      Style(res, color);

      return res;
    });
    // Bot Tag
    patch(getModule(m => m.displayName === 'MemberListItem').prototype, 'renderBot', (args, res, _this) => {
      if (!res || !this.settings.get('BotTag', DefaultSettings.BotTag)) return res;

      const { guildId, user: { id: userId } } = _this.props;

      const color = getColor(guildId, userId);
      if (!color) return res;

      res.props.color = color;

      return res;
    });

    // Voice
    patch(getModule(m => m.displayName === 'VoiceUser').prototype, 'renderName', (args, res, _this) => {
      if (!res || !this.settings.get('Voice', DefaultSettings.Voice)) return res;
      const { guildId, user: { id: userId } } = _this.props;

      const color = getColor(guildId, userId);
      if (!color) return res;

      Style(res, color);

      return res;
    });

    // User Info Area
    patch(getModule(m => String(m.default).includes('e.within')), 'default', args => {
      if (args[0].children.props.className !== `${nameTag} ${canCopy}` || (!this.settings.get('UITitle', DefaultSettings.UITitle) && !this.settings.get('UIStatus', DefaultSettings.UIStatus))) return;

      const color = getColor(getGuildId(), user.getCurrentUser().id);
      if (!color) return;

      if (this.settings.get('UITitle', DefaultSettings.UITitle)) {
        TempPatch(findInReactTree(args, m => m.type?.displayName === 'PanelTitle'), 'type', Type => {
          Style(Type, color);
          return Type;
        });
      }

      if (this.settings.get('UIStatus', DefaultSettings.UIStatus)) Style(findInReactTree(args, m => m.type?.displayName === 'HoverRoll'), color);
    }, 'before');

    // User Popout
    patch(getModule(m => m.type?.displayName === 'UserPopoutContainer'), 'type', (args, res) => {
      if (!res || (!this.settings.get('UPNickname', DefaultSettings.UPNickname) && !this.settings.get('UPUsername', DefaultSettings.UPUsername) && !this.settings.get('UPStatus', DefaultSettings.UPStatus) && !this.settings.get('UPBio', DefaultSettings.UPBio))) return res;

      const { guildId, userId } = args[0];

      const color = getColor(guildId, userId);
      if (!color) return res;

      TempPatch(res, 'type', Type => {
        const { children } = Type.props.children.props;

        if (this.settings.get('UPNickname', DefaultSettings.UPNickname) || this.settings.get('UPUsername', DefaultSettings.UPUsername)) {
          TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserPopoutInfo'), 'type', Type => {
            if (this.settings.get('UPNickname', DefaultSettings.UPNickname)) {
              const nickname = findInReactTree(Type, m => m.type?.displayName === 'Header');
              Style(nickname, color);
            }

            if (this.settings.get('UPUsername', DefaultSettings.UPUsername)) {
              TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', (_Type, Args) => {
                Args.guildId = guildId;
                Args.userId = userId;
              }, true);
            }
            return Type;
          });
        }

        if (this.settings.get('UMStatus', DefaultSettings.UMStatus)) {
          TempPatch(findInTree(Type, m => m.type?.displayName === 'UserPopoutCustomStatus', { walkable: [ 'props', 'children', 'customStatus' ] }), 'type', Type => {
            TempPatch(Type, 'type', Type => {
              Style(Type, color);
              return Type;
            });
            return Type;
          });
        }

        if (this.settings.get('UMBio', DefaultSettings.UMBio)) {
          TempPatch(children[3].props.children[0], 'type', Type => {
            TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserBio'), 'type', Type => {
              Style(Type, color);
              return Type;
            });
            return Type;
          });
        }
        return Type;
      });

      return res;
    });
    // User Modal
    patchModalLazy(getModule.bind(this, m => m.default?.displayName === 'UserProfileModal'), 'default', (args, res) => {
      if (!this.settings.get('UMUsername', DefaultSettings.UMUsername) && !this.settings.get('UMStatus', DefaultSettings.UMStatus) && !this.settings.get('UMBio', DefaultSettings.UMBio)) return res;

      const { guildId, user: { id: userId } } = args[0];

      const color = getColor(guildId, userId);
      if (!color) return res;

      TempPatch(findInReactTree(res, m => m.type?.displayName === 'UserProfileModalHeader'), 'type', Type => {
        if (this.settings.get('UMUsername', DefaultSettings.UMUsername)) {
          TempPatch(findInReactTree(Type, m => m.type?.displayName === 'DiscordTag'), 'type', (_Type, Args) => {
            Args.guildId = guildId;
            Args.userId = userId;
          }, true);
        }

        if (this.settings.get('UMStatus', DefaultSettings.UMStatus)) {
          TempPatch(findInReactTree(Type, m => m.type?.displayName === 'CustomStatusActivity'), 'type', Type => {
            TempPatch(findInReactTree(Type, m => m.type?.displayName === 'CustomStatus'), 'type', Type => {
              Style(Type, color);
              return Type;
            });
            return Type;
          });
        }

        if (this.settings.get('UMBio', DefaultSettings.UMBio)) {
          const { body } = getModule('body', 'tabBar');

          TempPatch(findInReactTree(res, m => m.className === body)?.children, 'type', Type => {
            TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserInfoBase'), 'type', Type => {
              TempPatch(findInReactTree(Type, m => m.type?.displayName === 'UserBio'), 'type', Type => {
                Style(Type, color);
                return Type;
              });
              return Type;
            });
            return Type;
          });
        }
        return Type;
      });

      return res;
    });
    // Discord Tag
    patch(getModule(m => m.default?.displayName === 'DiscordTag'), 'default', args => {
      args[0].guildId = args[0].guildId ?? getGuildId();
      args[0].userId = args[0].userId ?? args[0].user.id;
    }, 'before');
    // Name Tag
    patch(getModule(m => m.default?.displayName === 'NameTag'), 'default', (args, res) => {
      const { nameTag: nameTagUM } = getModule('nameTag', 'header') ?? {};

      const { userId, guildId, className } = args[0];
      if ((className?.includes(headerTag) && !this.settings.get('UPUsername', DefaultSettings.UPUsername)) || (className?.includes(nameTagUM) && !this.settings.get('UMUsername', DefaultSettings.UMUsername))) return res;

      const color = getColor(guildId, userId);
      if (!color) return res;

      if (this.settings.get('BotTag', DefaultSettings.BotTag)) {
        const BotTag = findInReactTree(res, m => m.type?.displayName === 'BotTag');
        if (BotTag) BotTag.props.color = color;
      }

      Style(res.props.children[0], color);
      Style(res.props.children[1], color);

      return res;
    });

    // Bot Tag
    patch(getModule(m => m.default?.displayName === 'BotTag'), 'default', (args, res) => {
      if (!this.settings.get('BotTag', DefaultSettings.BotTag)) return res;

      const { color } = args[0];
      if (!color) return res;

      Style(res, 'black', { 'background-color': color });

      return res;
    });

    // Reactions
    new Promise(async resolve => resolve((await react.getComponent('ReactorsComponent')).component.prototype)).then(Reactions => {
      patch(Reactions, 'render', (args, res, _this) => {
        if (!this.settings.get('ReactionsModal', DefaultSettings.ReactionsModal)) return res;

        const { guildId } = _this.props;

        TempPatch(res.props, 'renderRow', RenderRow => {
          TempPatch(RenderRow, 'type', Type => {
            const { id: userId } = findInReactTree(Type, m => m.type?.displayName === 'DiscordTag').props.user;

            const color = getColor(guildId, userId);
            if (!color) return Type;

            const nickname = findInReactTree(Type, m => m.type === 'span');
            Style(nickname, color);
            return Type;
          });
          return RenderRow;
        });

        return res;
      });
    });

    // Audit Log
    new Promise(async resolve => resolve((await react.getComponent('UserHook')).component.prototype)).then(AuditLog => {
      patch(AuditLog, 'render', (args, res, _this) => {
        if (!this.settings.get('AuditLog', DefaultSettings.AuditLog)) return res;

        const { guildId } = findInTree(_this._reactInternals, m => m.guildId, { walkable: [ 'return', 'stateNode', 'props' ] });
        const userId = _this.props.user.id;

        const color = getColor(guildId, userId);
        if (!color) return res;

        Style(res, color);

        return res;
      });
    });
  }
}
