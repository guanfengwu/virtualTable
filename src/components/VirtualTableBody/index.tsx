/*
 * @Author: WGF
 * @Date: 2023-01-28 17:30:44
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-30 17:35:27
 * @FilePath: \umi\src\components\VirtualTableBody\index.tsx
 * @Description: 文件描述
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import styles from './index.less';
import useKey from 'react-use/lib/useKey';
const visibleHeight = 280; // 表格可视高度
const itemHeight = 28; // 行高
const visibleCount = Math.ceil(visibleHeight / itemHeight) + 2; // 可视行数

const IndexPage: React.FC<{
  dataSource: any;
  columns: any;
  selectionType?: 'checkbox' | 'radio'; // 选择模式(单选或多选)
}> = (props) => {
  const { dataSource, columns, selectionType = 'radio' } = props;
  const [list, setList] = useState(dataSource.slice(0, visibleCount));
  const [selectKeyValue, setSelectKeyValue] = useState<string[]>([]); // 存储当前选中项的唯一标识值
  const [selectItem, setSelectItem] = useState<any[]>([]); // 存储当前选中项的唯一标识值
  const [shadowItemKey, setShadowItemKey] = useState<string>(list[0].key); // 记录当前阴影行
  const panelRef = useRef<any>();
  const listRef = useRef<any>();
  const renderListRef = useRef<any>();
  const indexRef = useRef<number>(0);
  /**
   * 鼠标滚动事件
   */
  const scrollEvent = useCallback(
    (e) => {
      console.log('触发了');

      const startIdx = Math.floor(e.target.scrollTop / itemHeight);
      const endIdx = startIdx + visibleCount;
      renderListRef.current = dataSource.slice(startIdx, endIdx);
      setList(dataSource.slice(startIdx, endIdx));
      const offset = startIdx * itemHeight;
      listRef.current.style.top = offset + 'px';
    },
    [dataSource],
  );

  useKey(
    'ArrowUp',
    (e) => {
      e.preventDefault();
      if (indexRef.current === 0) {
        panelRef.current.scrollTop = panelRef.current.scrollTop - 28;
        setTimeout(() => {
          setShadowItemKey(renderListRef.current[indexRef.current]?.key || '');
        }, 50);
      } else {
        indexRef.current--;
        setShadowItemKey(list[indexRef.current]?.key || '');
      }
    },
    {},
    [list],
  );
  useKey(
    'ArrowDown',
    (e) => {
      e.preventDefault();
      console.log('ArrowDown', indexRef.current);

      if (indexRef.current === 9) {
        panelRef.current.scrollTop = panelRef.current.scrollTop + 28;
        setTimeout(() => {
          setShadowItemKey(renderListRef.current[indexRef.current]?.key || '');
        }, 50);
      } else {
        indexRef.current++;
        setShadowItemKey(list[indexRef.current]?.key || '');
      }
    },
    {},
    [list],
  );

  useKey(
    'Enter',
    (e) => {
      // e.stopPropagation();
      e.preventDefault();
      console.log(list[indexRef.current], indexRef.current);
      selectRow(list[indexRef.current], indexRef.current);
    },
    {},
    [list, selectKeyValue],
  );

  /**
   * 直接根据行点击事件进行触发(暂时不需要对checkbox单独定义onchange方法)
   * @param e
   */
  const onChange = (e: CheckboxChangeEvent) => {};

  useEffect(() => {
    listRef.current = document.querySelector('.list');
  }, []);
  /**
   * 行点击事件
   * @param selected
   */
  const selectRow = (selected: any, index: number) => {
    setShadowItemKey(selected.key);
    indexRef.current = index;
    // 单选模式下
    if (selectionType === 'radio') {
      if (selectKeyValue.includes(selected.key)) {
        setSelectKeyValue([]);
      } else {
        setSelectKeyValue([selected.key]);
      }
    }
    // 多选模式下
    if (selectionType === 'checkbox') {
      if (selectKeyValue.includes(selected.key)) {
        setSelectKeyValue(selectKeyValue.filter((key) => key !== selected.key));
      } else {
        setSelectKeyValue([selected.key, ...selectKeyValue]);
      }
    }
  };

  return (
    <div
      style={{
        height: visibleHeight + 'px',
        width: '100%',
        textAlign: 'center',
        overflow: 'auto',
        position: 'absolute',
        overscrollBehavior: 'contain',
      }}
      onScroll={scrollEvent}
      ref={panelRef}
    >
      <div style={{ height: dataSource.length * itemHeight + 'px' }}></div>
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
        {list.map((item: any, index: number) => {
          return (
            <div
              key={item.key}
              className={`${styles.row} ${
                selectKeyValue.includes(item.key) ? styles.selectRow : ''
              } ${
                shadowItemKey === item.key ? styles.shadowRow : styles.bgRow
              } `}
              style={{
                height: itemHeight + 'px',
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setShadowItemKey(item.key);
                indexRef.current = index;
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                setShadowItemKey(item.key);
                indexRef.current = index;
              }}
              onClick={(e) => {
                e.stopPropagation;
                selectRow(item, index);
              }}
            >
              <div className={styles.checkbox}>
                <Checkbox
                  key={item.key}
                  onChange={onChange}
                  checked={selectKeyValue.includes(item.key)}
                  value={item}
                />
              </div>

              {columns.map((col: any) => {
                return (
                  <div key={col.key} style={{ width: `${col.width}px` }}>
                    {item[col.key]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndexPage;
