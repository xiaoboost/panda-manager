import './index.less';

import React from 'react';

import { stringifyClass } from '@panda/utils';
import { MenuList, getRouteNameByPath } from './menu';

import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

export function Sidebar() {
  const { pathname } = useLocation();
  const highlight = getRouteNameByPath(pathname);

  return (
    <aside className='app-sidebar'>
      <ul className='app-menu-list'>
        {MenuList.map((item) => (
          <li
            key={item.name}
            className={stringifyClass('app-menu-item', {
              'app-menu-item__highlight': highlight === item.name,
            })}
          >
            <item.Icon className='app-menu-item__icon' />
            <Link to={item.path} className='app-menu-item__link'>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
