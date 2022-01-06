import React, { memo } from 'react';
import { Category, SwitchItem } from '@vizality/components/settings';

import { DefaultSettings } from '../constants';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return <>
    <Category
      title={'Chat'}
    >
      <SwitchItem
        value={getSetting('RepliedMessageBorder', DefaultSettings.RepliedMessageBorder)}
        onChange={() => toggleSetting('RepliedMessageBorder')}
      >
        {'Replied Message Border'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Timestamp', DefaultSettings.Timestamp)}
        onChange={() => toggleSetting('Timestamp')}
      >
        {'Timestamp'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Message', DefaultSettings.Message)}
        onChange={() => toggleSetting('Message')}
      >
        {'Message'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Mention', DefaultSettings.Mention)}
        onChange={() => toggleSetting('Mention')}
      >
        {'Mention'}
      </SwitchItem>
      <SwitchItem
        description={'Show user avatar instead of `@` in user mention'}
        value={getSetting('UserMentionAvatar', DefaultSettings.UserMentionAvatar)}
        onChange={() => toggleSetting('UserMentionAvatar')}
      >
        {'User Mention Avatar'}
      </SwitchItem>
      <SwitchItem
        description={'Show role icon instead of `@` in role mention'}
        value={getSetting('RoleMentionIcon', DefaultSettings.RoleMentionIcon)}
        onChange={() => toggleSetting('RoleMentionIcon')}
      >
        {'Role Mention Icon'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Typing', DefaultSettings.Typing)}
        onChange={() => toggleSetting('Typing')}
      >
        {'Typing'}
      </SwitchItem>
    </Category>
    <Category
      title={'Member List'}
    >
      <SwitchItem
        value={getSetting('MLSection', DefaultSettings.MLSection)}
        onChange={() => toggleSetting('MLSection')}
      >
        {'Section (Member Group)'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('MLUserActivity', DefaultSettings.MLUserActivity)}
        onChange={() => toggleSetting('MLUserActivity')}
      >
        {'User Activity'}
      </SwitchItem>
    </Category>
    <Category
      title={'Channel List'}
    >
      <SwitchItem
        value={getSetting('Voice', DefaultSettings.Voice)}
        onChange={() => toggleSetting('Voice')}
      >
        {'Voice'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UITitle', DefaultSettings.UITitle)}
        onChange={() => toggleSetting('UITitle')}
      >
        {'User Info Title'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UIStatus', DefaultSettings.UIStatus)}
        onChange={() => toggleSetting('UIStatus')}
      >
        {'User Info Status'}
      </SwitchItem>
    </Category>
    <Category
      title={'User Popout'}
    >
      <SwitchItem
        value={getSetting('UPNickname', DefaultSettings.UPNickname)}
        onChange={() => toggleSetting('UPNickname')}
      >
        {'Nickname'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPUsername', DefaultSettings.UPUsername)}
        onChange={() => toggleSetting('UPUsername')}
      >
        {'Username'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPStatus', DefaultSettings.UPStatus)}
        onChange={() => toggleSetting('UPStatus')}
      >
        {'Status'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPBio', DefaultSettings.UPBio)}
        onChange={() => toggleSetting('UPBio')}
      >
        {'Bio'}
      </SwitchItem>
    </Category>
    <Category
      title={'User Modal'}
    >
      <SwitchItem
        value={getSetting('UMUsername', DefaultSettings.UMUsername)}
        onChange={() => toggleSetting('UMUsername')}
      >
        {'Username'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMStatus', DefaultSettings.UMStatus)}
        onChange={() => toggleSetting('UMStatus')}
      >
        {'Status'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMBio', DefaultSettings.UMBio)}
        onChange={() => toggleSetting('UMBio')}
      >
        {'Bio'}
      </SwitchItem>
    </Category>
    <Category
      title={'Other'}
    >
      <SwitchItem
        value={getSetting('BotTag', DefaultSettings.BotTag)}
        onChange={() => toggleSetting('BotTag')}
      >
        {'Bot Tag'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('ReactionsModal', DefaultSettings.ReactionsModal)}
        onChange={() => toggleSetting('ReactionsModal')}
      >
        {'Reactions Modal'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('AuditLog', DefaultSettings.AuditLog)}
        onChange={() => toggleSetting('AuditLog')}
      >
        {'Audit Log'}
      </SwitchItem>
    </Category>
  </>;
});
