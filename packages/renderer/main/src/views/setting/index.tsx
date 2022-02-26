import React from 'react';

import { style } from './style';
import { Directories } from './directories';
import { Display } from './display';

import { useMap } from '@panda/renderer-utils';
import { SettingData } from '@panda/shared';
import { initSettingData } from './utils/constant';

export function Setting() {
  const [setting, patchSetting] = useMap<SettingData>(initSettingData);

  return (
    <div className={style.classes.setting}>
      <Directories
        data={setting.directories}
        patch={(dirs) => patchSetting.set('directories', dirs)}
      />
      <Display
        data={setting.sort}
        patch={(sort) => patchSetting.set('sort', sort)}
      />
    </div>
  );
}
