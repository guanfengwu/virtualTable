/*
 * @Author: WGF
 * @Date: 2023-01-18 11:08:39
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-30 17:38:51
 * @FilePath: \umi\src\pages\Section2\index.tsx
 * @Description: 文件描述
 */
import React from 'react';
import styles from './index.less';
import VirtualTable from '@/components/VirtualTable';

const IndexPage: React.FC<{}> = (props) => {
  const dataSource = Array.from(Array(30000), (item, index) => ({
    key: index + 1,
    code: index + 1,
    name: `名称${index + 1}`,
  }));

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 300 },
    { title: '名称', dataIndex: 'name', key: 'name' },
  ];
  // return <VirtualTable dataSource={source} columns={columns} />;

  return <VirtualTable dataSource={dataSource} columns={columns} />;
};
export default IndexPage;
