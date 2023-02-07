/*
 * @Author: WGF
 * @Date: 2023-01-18 11:08:39
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 11:04:28
 * @FilePath: \umi\src\pages\Section2\index.tsx
 * @Description: 文件描述
 */
import React, { useState } from 'react';
import NormalSearch from './components/NormalSearch';

const IndexPage: React.FC<{}> = (props) => {
  async function searchRequest(keyWord: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dataSource = Array.from(Array(10000), (item, index) => ({
          key: `${keyWord}${index + 1}`,
          code: `${keyWord}${index + 1}`,
          name: `测试${keyWord}${index + 1}`,
          other: `other测试${keyWord}${index + 1}`,
        }));
        resolve(dataSource);
      }, 1000);
    });
  }

  const onSelect = (select: string[], selectItem: object[]) => {
    console.log(
      '调用----',
      '(选中的key值)',
      select,
      '(选中的对象)',
      selectItem,
    );
  };

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '其他', dataIndex: 'other', key: 'other', width: 200 },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '500px' }}>
        <div>多选</div>
        <NormalSearch
          fetchOptions={searchRequest}
          selectionType="checkbox"
          onSelect={onSelect}
          columns={columns}
        />
      </div>
      <div style={{ width: '500px', marginLeft: '100px' }}>
        <div>单选</div>
        <NormalSearch
          fetchOptions={searchRequest}
          selectionType="radio"
          onSelect={onSelect}
          columns={columns}
        />
      </div>
    </div>
  );
};
export default IndexPage;
