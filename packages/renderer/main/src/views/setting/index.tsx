import React from 'react';

import { useEffect, useState } from 'react';

import { styles } from './style';
import { Directories } from './components/directories';
import { Display } from './components/display';

import { fetch, ServiceName } from '@panda/fetch/renderer';
import { SettingData, SortOption, SortBy } from '@panda/shared';

const initSettingData: SettingData = {
  directories: [],
  sort: {
    by: SortBy.name,
    asc: true,
  },
};

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
    <div className={styles.classes.setting}>
      <Directories data={setting.directories} patch={patchDir} />
      <Display data={setting.sort} patch={patchSort} />
    </div>
  );
}
