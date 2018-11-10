import * as React from 'react';
import { TagData } from 'store';
import { Row, Col, Modal, Input, Tag, Icon, Tooltip } from 'antd';

type TagState = Omit<TagData, 'id'>;

export default class TagEditer extends React.Component<{}, TagState> {
    state: TagState = {
        name: '',
        alias: [],
    };

    render() {
        const { name, alias } = this.state;

        return <>
            <Row gutter={6} align='middle'>
                <Col span={4}>名称</Col>
                <Col span={20}>
                    <Input placeholder='请输入标签名称' value={name}></Input>
                </Col>
            </Row>
            <Row gutter={6} align='middle'>
                <Col span={4}>标签别名</Col>
                <Col span={20}>
                    <Input placeholder='请输入标签名称' value={name}></Input>
                </Col>
            </Row>
        </>;
    }
}
