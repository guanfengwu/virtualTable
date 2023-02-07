/*
 * @Author: WGF
 * @Date: 2023-01-28 17:30:44
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 10:50:38
 * @FilePath: \umi\src\components\VirtualTableBody\index.tsx
 * @Description: 文件描述
 */

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Checkbox, Radio } from 'antd';
import './index.less';
import useKey from 'react-use/lib/useKey';
const checkComponents = {
  checkbox: Checkbox,
  radio: Radio,
};
const IndexPage: React.FC<{
  dataSource: any[]; // 源数据
  columns: object[]; // 行配置
  visibleHeight: number; // 表格可视高度
  selectionType?: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  onSelect?: Function; // 点击行时触发的方法(获取到当前所有已选中的行数据)
  selectDefault?: string[]; // 默认当前选中的数据（key值)
  onChange?: Function; // 点击行时触发的方法(获取到当前点击的行数据)
  setHeadValue?: Function;
  keyWord?: string; // 高亮的关键词
}> = (props) => {
  const {
    dataSource,
    columns,
    selectionType = 'radio',
    visibleHeight,
    onSelect,
    selectDefault,
    onChange,
    keyWord,
    setHeadValue,
  } = props;
  const itemHeight = 28; // 行高
  const visibleCount = useMemo(
    () => Math.ceil(visibleHeight / itemHeight) + 2,
    [visibleHeight],
  ); // 可视行数
  const [list, setList] = useState(dataSource.slice(0, visibleCount)); // 当前渲染列表数据
  const [selectKeyValue, setSelectKeyValue] = useState<string[]>(
    selectDefault || [],
  ); // 存储当前选中项的唯一标识值
  const [shadowItemKey, setShadowItemKey] = useState<string>(
    selectDefault?.[0] || list[0]?.key,
  ); // 记录当前阴影行
  const panelRef = useRef<any>();
  const listRef = useRef<any>();
  const renderListRef = useRef<any>(dataSource.slice(0, visibleCount));
  const indexRef = useRef<number>(0);
  const inKeyBoard = useRef<boolean>(false);

  /**
   * 键盘事件监听(目前支持ArrowUp,ArrowDown,Enter按键)
   */
  useKey(
    'ArrowUp',
    (e) => {
      if (panelRef.current.getBoundingClientRect().top === 0) return;
      e.preventDefault();
      inKeyBoard.current = true;
      if (indexRef.current <= 0) {
        panelRef.current.scrollTop =
          Math.floor(panelRef.current.scrollTop / itemHeight) * itemHeight -
          itemHeight;
        setTimeout(() => {
          renderListRef.current &&
            setShadowItemKey(
              renderListRef.current[indexRef.current]?.key || '',
            );
          indexRef.current = 0;
        }, 50);
      } else {
        indexRef.current--;
        setShadowItemKey(list[indexRef.current]?.key || '');
      }
      setTimeout(() => {
        inKeyBoard.current = false;
      }, 100);
    },
    {},
    [list],
  );
  useKey(
    'ArrowDown',
    (e) => {
      if (panelRef.current.getBoundingClientRect().top === 0) return;
      e.preventDefault();
      inKeyBoard.current = true;
      if (indexRef.current >= 9) {
        if (indexRef.current === 10) {
          panelRef.current.scrollTop =
            Math.ceil(panelRef.current.scrollTop / itemHeight) * itemHeight +
            itemHeight;
        } else {
          panelRef.current.scrollTop =
            Math.floor(panelRef.current.scrollTop / itemHeight) * itemHeight +
            itemHeight;
        }
        indexRef.current = 9;
        setTimeout(() => {
          setShadowItemKey(renderListRef.current[indexRef.current]?.key || '');
        }, 50);
      } else {
        indexRef.current++;
        setShadowItemKey(renderListRef.current[indexRef.current]?.key || '');
      }
      setTimeout(() => {
        inKeyBoard.current = false;
      }, 100);
    },
    {},
    [list],
  );
  useKey(
    'Enter',
    (e) => {
      if (panelRef.current.getBoundingClientRect().top === 0) return;
      e.preventDefault();
      selectRow(list[indexRef.current], indexRef.current);
    },
    {},
    [list, selectKeyValue],
  );
  useEffect(() => {
    setSelectKeyValue(selectDefault || []);
  }, [selectDefault]);

  useEffect(() => {
    setHeadValue?.(selectKeyValue);
  }, [selectKeyValue]);
  useEffect(() => {
    onSelect?.(
      selectKeyValue,
      dataSource.filter((item: any) => selectKeyValue.includes(item.key)),
    );
  }, [selectKeyValue, dataSource]);

  /**
   * 行点击事件
   * @param selected
   */
  const selectRow = (selected: any, index: number) => {
    setShadowItemKey(selected.key);
    indexRef.current = index;
    // 单选模式下
    if (selectionType === 'radio') {
      onChange?.(selected);
      if (selectKeyValue.includes(selected.key)) {
        setSelectKeyValue([]);
      } else {
        setSelectKeyValue([selected.key]);
      }
    }
    // 多选模式下
    if (selectionType === 'checkbox') {
      onChange?.(selected);
      if (selectKeyValue.includes(selected.key)) {
        setSelectKeyValue(selectKeyValue.filter((key) => key !== selected.key));
      } else {
        setSelectKeyValue([selected.key, ...selectKeyValue]);
      }
    }
  };

  /**
   * 鼠标滚动事件
   */
  const scrollEvent = useCallback(
    (e) => {
      const startIdx = Math.floor(e.target.scrollTop / itemHeight);
      const endIdx = startIdx + visibleCount;
      renderListRef.current = dataSource.slice(startIdx, endIdx);
      setList(dataSource.slice(startIdx, endIdx));
      const offset = startIdx * itemHeight;
      listRef.current.style.top = offset + 'px';
    },
    [dataSource],
  );

  // const renderText = (title: string | React.ReactNode, columnWidth: number) => {
  //   if (!keyWord) {
  //     return <PanUIBoxEllipsis rendering={columnWidth} text={<span>{title}</span>} />;
  //   }
  //   let resultNodeText = String(title);
  //   const searchValueArr = keyWord?.trim().split(' ').filter(Boolean).join('|');
  //   let reg = new RegExp('(' + searchValueArr + ')', 'ig');
  //   resultNodeText = resultNodeText.replace(reg, '<span style="color:var(--ant-primary-color)">$1</span>');
  //   return (
  //     <PanUIBoxEllipsis rendering={columnWidth} text={<span dangerouslySetInnerHTML={{ __html: resultNodeText }} />} />
  //   );
  // };

  return (
    <div
      style={{
        height: visibleHeight + 'px',
        width: '100%',
        textAlign: 'center',
        overflow: 'auto',
        position: 'relative',
        overscrollBehavior: 'contain',
      }}
      className="panui-virtual-table-body"
      onScroll={scrollEvent}
      ref={panelRef}
    >
      <div style={{ height: dataSource.length * itemHeight + 'px' }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: visibleHeight + 'px',
        }}
        ref={listRef}
      >
        <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <colgroup>
            <col width="36px" />
            {columns.map((col: any, index: number) => {
              return (
                <col
                  key={col.key}
                  {...(col.width
                    ? {
                        width:
                          index === columns.length - 1
                            ? `${col.width - 6}px`
                            : `${col.width}px`,
                      }
                    : {})}
                />
              );
            })}
          </colgroup>
          <tbody>
            {list.map((item: any, index: number) => {
              return (
                <tr
                  key={item.key}
                  className={`${
                    selectKeyValue.includes(item.key)
                      ? 'panui-virtual-table-body-row-select'
                      : ''
                  } ${
                    shadowItemKey === item.key
                      ? 'panui-virtual-table-body-row-shadow'
                      : 'panui-virtual-table-body-row-bg'
                  } `}
                  style={{
                    height: itemHeight + 'px',
                  }}
                  onMouseEnter={(e) => {
                    if (!inKeyBoard.current) {
                      e.stopPropagation();
                      setShadowItemKey(item.key);
                      indexRef.current = index;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!inKeyBoard.current) {
                      e.stopPropagation();
                      setShadowItemKey(item.key);
                      indexRef.current = index;
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectRow(item, index);
                  }}
                >
                  <td className="panui-virtual-table-body-row-checkbox">
                    {(() => {
                      const CheckComponent = checkComponents[selectionType];
                      return (
                        <CheckComponent
                          key={item.key}
                          checked={selectKeyValue.includes(item.key)}
                          value={item}
                        />
                      );
                    })()}
                  </td>
                  {columns.map((col: any) => {
                    return (
                      <td
                        key={col.key}
                        className="panui-virtual-table-body-row-colBox "
                      >
                        {item[col.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndexPage;
