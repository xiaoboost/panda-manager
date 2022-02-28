import React from 'react';

import { useEffect, useState } from 'react';

import { style } from './style';
import { Directories } from './directories';
import { Display } from './display';

import { fetch } from '@panda/fetch/renderer';
import { SettingData, ServiceName, SortOption } from '@panda/shared';
import { initSettingData } from './utils/constant';

export function Setting() {
  const [setting, patchSetting] = useState<SettingData>(initSettingData);
  const patchDir = (directories: string[]) => {
    fetch<SettingData>(ServiceName.PatchConfig, { directories }).then(({ data }) =>
      patchSetting(data),
    );
  };
  const patchSort = (sort: SortOption) => {
    fetch<SettingData>(ServiceName.PatchConfig, { sort }).then(({ data }) => patchSetting(data));
  };

  // 获取初始数据
  useEffect(() => {
    fetch<SettingData>(ServiceName.GetConfig).then(({ data }) => {
      patchSetting(data);
    });
  }, []);

  return (
    <div className={style.classes.setting}>
      <Directories data={setting.directories} patch={patchDir} />
      <Display data={setting.sort} patch={patchSort} />
    </div>
  );
}
