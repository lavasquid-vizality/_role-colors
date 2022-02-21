import React, { memo, useState } from 'react';
import { getModule } from '@vizality/webpack';

const { AnimatedAvatar, Sizes } = getModule(m => m.AnimatedAvatar);

const { getUser } = getModule(m => m.getUser && m.getUsers);

export default memo(({ guildId, userId, children }) => {
  const [ animate, setAnimate ] = useState(false);
  const User = getUser(userId);

  const onMouse = {
    onMouseEnter: () => setAnimate(true),
    onMouseLeave: () => setAnimate(false)
  };

  return <div style={{ alignItems: 'center', display: 'inline-flex', verticalAlign: 'bottom' }} {...User?.avatar?.startsWith('a_') ? onMouse : null}>
    {User && <AnimatedAvatar className={'RC-Avatar'} src={User.getAvatarURL(guildId, 16, animate)} size={Sizes.SIZE_16} animate={animate} />}
    {children === `<@${userId}>` ? children : children.substr ? children.substr(1) : children}
  </div>;
});
