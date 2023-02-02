/*
 * @Author: WGF
 * @Date: 2023-01-30 11:17:32
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-31 23:44:51
 * @FilePath: \umi\src\pages\test\index.tsx
 * @Description: 文件描述
 */
import React, { useState } from 'react';
import { Select } from 'antd';

const App: React.FC = () => {
  const [value, setValue] = useState<string>();
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setValue(value);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };
  return (
    <div>
      <button
        onClick={() => {
          onChange('luck');
        }}
      >
        www
      </button>
      <Select
        showSearch
        value={value}
        placeholder="Select a person"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'tom',
            label: 'Tom',
          },
        ]}
      />
    </div>
  );
};

export default App;
