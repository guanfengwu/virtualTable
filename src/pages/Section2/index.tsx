/*
 * @Author: WGF
 * @Date: 2023-01-18 11:08:39
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-03 13:47:37
 * @FilePath: \umi\src\pages\Section2\index.tsx
 * @Description: 文件描述
 */
import React from 'react';
import styles from './index.less';
import NormalSearch from './components/NormalSearch';

const IndexPage: React.FC<{}> = (props) => {
  async function searchRequest(keyWord: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dataSource = Array.from(Array(3000), (item, index) => ({
          key: `${keyWord}${index + 1}`,
          code: `${keyWord}${index + 1}`,
          name: `测试${keyWord}${index + 1}`,
          other: '1234',
        }));
        resolve(dataSource);
      }, 1000);
    });
  }

  const onSelect = (select: string[], selectItem: any[]) => {
    console.log(
      '调用----',
      '(选中的key值)',
      select,
      '(选中的对象)',
      selectItem,
    );
  };
  return (
    <div>
      <div>单选</div>
      <NormalSearch
        fetchOptions={searchRequest}
        selectionType={'radio'}
        onSelect={onSelect}
      />
      <div style={{ height: '50px' }}>------</div>
      <div>多选</div>
      <NormalSearch
        fetchOptions={searchRequest}
        selectionType={'checkbox'}
        onSelect={onSelect}
      />
    </div>
  );
};
export default IndexPage;
