import './index.styl'

import { default as React, useState, PropsWithChildren } from 'react';

import { Category, CategoryMap } from 'renderer/lib/manga';
import { stringifyClass } from 'utils/web';

import { Select } from 'antd';

interface Props {
    defaultValue?: Category;
    onChange: (val: Category) => void;
}

const categoryKeys = Object.keys(CategoryMap).map(Number) as Category[];

export default function CategorySelector(props: PropsWithChildren<Props>) {
    const [state, setState] = useState(props.defaultValue);

    const selectStyle: React.CSSProperties = !state ? {} : {
        backgroundColor: CategoryMap[state].color,
        borderColor: CategoryMap[state].color,
    };

    const onChange = (val: Category) => {
        setState(val);
        props.onChange(val);
    };

    return (
        <Select
            size='small'
            defaultValue={state}
            onChange={onChange}
            placeholder='Category'
            className={stringifyClass('category-selector', {
                'category-selector-has-value': Boolean(state),
            })}
            style={{
                width: 100,
                ...selectStyle,
            }}
            dropdownMenuStyle={{ maxHeight: 'none' }}>
            {categoryKeys.map((key) => (
                <Select.Option
                    key={key}
                    className='category-selector-option'
                    style={{
                        backgroundColor: CategoryMap[key].color,
                    }}>{CategoryMap[key].label}
                </Select.Option>
            ))}
        </Select>
    );
}
