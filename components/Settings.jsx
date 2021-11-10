import React, { memo } from 'react';
import { Category, SwitchItem } from '@vizality/components/settings';

import { defaultSettings } from '../constants';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return <>
    <Category
      title={'Chat'}
    >
      <SwitchItem
        value={getSetting('RepliedMessageBorder', defaultSettings.RepliedMessageBorder)}
        onChange={() => toggleSetting('RepliedMessageBorder')}
      >
        {'Replied Message Border'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Timestamp', defaultSettings.Timestamp)}
        onChange={() => toggleSetting('Timestamp')}
      >
        {'Timestamp'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Message', defaultSettings.Message)}
        onChange={() => toggleSetting('Message')}
      >
        {'Message'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Mention', defaultSettings.Mention)}
        onChange={() => toggleSetting('Mention')}
      >
        {'Mention'}
      </SwitchItem>
      <SwitchItem
        description={'Show user avatar instead of `@` in user mention'}
        value={getSetting('UserMentionAvatar', defaultSettings.UserMentionAvatar)}
        onChange={() => toggleSetting('UserMentionAvatar')}
      >
        {'User Mention Avatar'}
      </SwitchItem>
      <SwitchItem
        description={'Show role icon instead of `@` in role mention'}
        value={getSetting('RoleMentionIcon', defaultSettings.RoleMentionIcon)}
        onChange={() => toggleSetting('RoleMentionIcon')}
      >
        {'Role Mention Icon'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Typing', defaultSettings.Typing)}
        onChange={() => toggleSetting('Typing')}
      >
        {'Typing'}
      </SwitchItem>
    </Category>
    <Category
      title={'Member List'}
    >
      <SwitchItem
        value={getSetting('MLSection', defaultSettings.MLSection)}
        onChange={() => toggleSetting('MLSection')}
      >
        {'Section (Member Group)'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('MLUserActivity', defaultSettings.MLUserActivity)}
        onChange={() => toggleSetting('MLUserActivity')}
      >
        {'User Activity'}
      </SwitchItem>
    </Category>
    <Category
      title={'Channel List'}
    >
      <SwitchItem
        value={getSetting('Voice', defaultSettings.Voice)}
        onChange={() => toggleSetting('Voice')}
      >
        {'Voice'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UITitle', defaultSettings.UITitle)}
        onChange={() => toggleSetting('UITitle')}
      >
        {'User Info Title'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UIStatus', defaultSettings.UIStatus)}
        onChange={() => toggleSetting('UIStatus')}
      >
        {'User Info Status'}
      </SwitchItem>
    </Category>
    <Category
      title={'User Popout'}
    >
      <SwitchItem
        value={getSetting('UPNickname', defaultSettings.UPNickname)}
        onChange={() => toggleSetting('UPNickname')}
      >
        {'Nickname'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPUsername', defaultSettings.UPUsername)}
        onChange={() => toggleSetting('UPUsername')}
      >
        {'Username'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPStatus', defaultSettings.UPStatus)}
        onChange={() => toggleSetting('UPStatus')}
      >
        {'Status'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UPBio', defaultSettings.UPBio)}
        onChange={() => toggleSetting('UPBio')}
      >
        {'Bio'}
      </SwitchItem>
    </Category>
    <Category
      title={'User Modal'}
    >
      <SwitchItem
        value={getSetting('UMUsername', defaultSettings.UMUsername)}
        onChange={() => toggleSetting('UMUsername')}
      >
        {'Username'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMStatus', defaultSettings.UMStatus)}
        onChange={() => toggleSetting('UMStatus')}
      >
        {'Status'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('UMBio', defaultSettings.UMBio)}
        onChange={() => toggleSetting('UMBio')}
      >
        {'Bio'}
      </SwitchItem>
    </Category>
    <Category
      title={'Other'}
    >
      <SwitchItem
        value={getSetting('BotTag', defaultSettings.BotTag)}
        onChange={() => toggleSetting('BotTag')}
      >
        {'Bot Tag'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('ReactionsModal', defaultSettings.ReactionsModal)}
        onChange={() => toggleSetting('ReactionsModal')}
      >
        {'Reactions Modal'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('AuditLog', defaultSettings.AuditLog)}
        onChange={() => toggleSetting('AuditLog')}
      >
        {'Audit Log'}
      </SwitchItem>
    </Category>
  </>;
});
