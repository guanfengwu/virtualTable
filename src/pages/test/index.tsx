/*
 * @Author: WGF
 * @Date: 2023-01-30 11:17:32
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-30 11:17:43
 * @FilePath: \umi\src\pages\test\index.tsx
 * @Description: 文件描述
 */
import { useState } from 'react';
import { useKey } from 'react-use';

const Demo = () => {
  const [count, set] = useState(0);
  const increment = () => set((count) => ++count);
  useKey('ArrowUp', increment);

  return <div>Press arrow up: {count}</div>;
};

export default Demo;
