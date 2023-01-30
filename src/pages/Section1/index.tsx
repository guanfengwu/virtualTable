/*
 * @Author: WGF
 * @Date: 2023-01-18 11:08:39
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-28 17:28:25
 * @FilePath: \umi\src\pages\Section1\index.tsx
 * @Description: 文件描述
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const visibleHeight = 360; // 表格可视高度
const itemHeight = 50; // 行高
const visibleCount = Math.ceil(visibleHeight / itemHeight) + 2; // 可视行数
const totalCount = 10000;

const source = Array.from(Array(totalCount), (item, index) => index);

export default function VirtualList() {
  const [list, setList] = useState(source);
  const listRef = useRef<any>();

  const scrollEvent = useCallback((e) => {
    const startIdx = Math.floor(e.target.scrollTop / itemHeight);
    const endIdx = startIdx + visibleCount;
    setList(source.slice(startIdx, endIdx));
    const offset = startIdx * itemHeight;
    listRef.current.style.top = offset + 'px';
  }, []);

  useEffect(() => {
    listRef.current = document.querySelector('.list');
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#FFF',
        height: visibleHeight + 'px',
        textAlign: 'center',
        overflow: 'auto',
        position: 'relative',
        overscrollBehavior: 'contain',
      }}
      onScroll={scrollEvent}
    >
      <div style={{ height: totalCount * itemHeight + 'px' }}></div>
      <div
        className="list"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: visibleHeight + 'px',
        }}
      >
        {list.map((item) => {
          return (
            <div
              key={item}
              style={{
                height: itemHeight + 'px',
                borderBottom: '1px solid #eee',
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
