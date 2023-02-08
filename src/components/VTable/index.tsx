/*
 * @Author: WGF
 * @Date: 2023-02-07 15:45:16
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-08 19:02:00
 * @FilePath: \umi\src\components\VTable\index.tsx
 * @Description: 文件描述
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Checkbox, Radio } from 'antd';
import './index.less';
import useKey from 'react-use/lib/useKey';
import ResizeObserver from 'rc-resize-observer';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { DataType, ColumnsType } from './interface';

const checkComponents = {
  checkbox: Checkbox,
  radio: Radio,
};
import { Resizable } from 'react-resizable';
const IndexPage: React.FC<{
  dataSource: DataType[]; // 源数据
  columns: ColumnsType[]; // 列配置
  visibleHeight: number; // 表格可视高度
  showHeader?: boolean; // 是否实现表头
  selectionType?: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  onSelect?: (keys: (string | number)[], checked: DataType[]) => void; // 点击行时触发的方法(获取到当前所有已选中的行数据)
  selectDefault?: (string | number)[]; // 默认当前选中的数据（key值)
  onChange?: (changed: DataType) => void; // 点击行时触发的方法(获取到当前点击的行数据)
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
  } = props;
  const itemHeight = 28; // 行高
  const visibleCount = useMemo(
    () => Math.ceil(visibleHeight / itemHeight) + 2,
    [visibleHeight],
  ); // 可视行数
  const [list, setList] = useState(dataSource.slice(0, visibleCount)); // 当前渲染列表数据
  const [columnsOpts, setColumnsOpts] = useState<ColumnsType[]>(columns); // 列配置属性
  const [checkedList, setCheckedList] = useState<(string | number)[]>(
    selectDefault || [],
  ); // 存储当前选中项的唯一标识值
  const [shadowItemKey, setShadowItemKey] = useState<string | number>(
    list[0]?.key,
  ); // 记录当前阴影行
  const [checkAll, setCheckAll] = useState(false); // 是否全选
  const [indeterminate, setIndeterminate] = useState(false);
  const [tableWidth, setTableWidth] = useState(0); // 当前表格宽度

  const panelRef = useRef<any>();
  const listRef = useRef<any>();
  const renderListRef = useRef<DataType[]>(dataSource.slice(0, visibleCount));
  const indexRef = useRef<number>(0);
  const inKeyBoard = useRef<boolean>(false); // 是否处于键盘操作

  useEffect(() => {
    const widthColumnCount = columns!.filter(({ width }) => !width).length;
    const widthCount = columns!.reduce(
      (sum, next) => sum + (next.width || 0),
      42,
    );
    const newCol = columns!.map((column) => {
      if (column.width) {
        return column;
      }
      return {
        ...column,
        width: Math.floor((tableWidth - widthCount) / widthColumnCount),
      };
    });
    setColumnsOpts(newCol);
  }, [tableWidth, columns]);

  useEffect(() => {
    setCheckedList(selectDefault || []);
  }, [selectDefault]);

  useEffect(() => {
    onSelect?.(
      checkedList,
      dataSource.filter((item: DataType) => checkedList.includes(item.key)),
    );
    const allKeys = dataSource.map((item: DataType) => item.key);
    let inDataSource = false;
    if (!!checkedList.length && checkedList.length < dataSource.length) {
      inDataSource = checkedList.some((key) => allKeys.includes(key));
    }
    setIndeterminate(inDataSource);
    setCheckAll(checkedList.length === dataSource.length);
  }, [checkedList, dataSource]);

  /**
   * 行点击事件
   * @param selected
   */
  const selectRow = (selected: DataType, index: number) => {
    setShadowItemKey(selected.key);
    indexRef.current = index;
    // 单选模式下
    if (selectionType === 'radio') {
      onChange?.(selected);
      if (checkedList.includes(selected.key)) {
        setCheckedList([]);
      } else {
        setCheckedList([selected.key]);
      }
    }
    // 多选模式下
    if (selectionType === 'checkbox') {
      onChange?.(selected);
      if (checkedList.includes(selected.key)) {
        setCheckedList(checkedList.filter((key) => key !== selected.key));
      } else {
        setCheckedList([selected.key, ...checkedList]);
      }
    }
  };
  /**
   * 点击全选按钮
   * @param e
   */
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const allKeys = dataSource.map((item: DataType) => item.key);
    if (e.target.checked === false) {
      dataSource.forEach((item: DataType) => {
        onChange?.(item);
      });
    }
    setCheckedList(e.target.checked ? allKeys : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
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
  /**
   * 拖动表头列宽触发
   * @param column
   * @returns
   */
  const handleResize =
    (column: ColumnsType) =>
    (e: any, { size }: any) => {
      const newColumnsOpts = columnsOpts.map((item: ColumnsType) => {
        if (item === column) {
          item.width = size.width;
        }
        return item;
      });
      setColumnsOpts(newColumnsOpts);
    };
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
    [list, checkedList],
  );
  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <div className="virtual-table">
        <div className="virtual-table-container">
          <div className="virtual-table-header">
            <table
              style={{
                width: '100%',
                tableLayout: 'fixed',
              }}
            >
              <colgroup>
                <col />
                {columnsOpts.map((col: ColumnsType) => {
                  return <col key={col.key} width={`${col.width}px`} />;
                })}
              </colgroup>
              <thead className="virtual-table-thead">
                <tr>
                  <th
                    className="virtual-table-cell virtual-table-selection-column"
                    scope="col"
                  >
                    {selectionType === 'checkbox' && (
                      <Checkbox
                        indeterminate={indeterminate}
                        onChange={onCheckAllChange}
                        checked={checkAll}
                      ></Checkbox>
                    )}
                  </th>
                  {columnsOpts.map((col: ColumnsType) => {
                    return (
                      <Resizable
                        key={col.key}
                        height={28}
                        width={col.width || 0}
                        onResize={handleResize(col)}
                        resizeHandles={['e']}
                      >
                        <th
                          key={col.key}
                          scope="col"
                          className="virtual-table-cell"
                        >
                          {col.title}
                        </th>
                      </Resizable>
                    );
                  })}
                </tr>
              </thead>
            </table>
          </div>
          <div
            className="virtual-table-body"
            style={{
              height: visibleHeight + 'px',
              width: '100%',
              textAlign: 'center',
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'relative',
              overscrollBehavior: 'contain',
            }}
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
                  <col />
                  {columnsOpts.map((col: ColumnsType) => {
                    return (
                      <col
                        key={col.key}
                        {...(col.width
                          ? {
                              width: `${col.width}px`,
                            }
                          : {})}
                      />
                    );
                  })}
                </colgroup>
                <tbody>
                  {list.map((item: DataType, index: number) => {
                    return (
                      <tr
                        key={item.key}
                        className={`${
                          checkedList.includes(item.key)
                            ? 'virtual-table-row-selected'
                            : ''
                        } ${
                          shadowItemKey === item.key
                            ? 'virtual-table-row-hover'
                            : 'virtual-table-row'
                        } `}
                        style={{
                          height: itemHeight + 'px',
                        }}
                        onMouseEnter={() => {
                          if (!inKeyBoard.current) {
                            setShadowItemKey(item.key);
                            indexRef.current = index;
                          }
                        }}
                        onMouseLeave={() => {
                          if (!inKeyBoard.current) {
                            setShadowItemKey(item.key);
                            indexRef.current = index;
                          }
                        }}
                        onClick={() => {
                          selectRow(item, index);
                        }}
                      >
                        <td className="virtual-table-cell virtual-table-selection-column">
                          <div className="virtual-table-selection">
                            {(() => {
                              const CheckComponent =
                                checkComponents[selectionType];
                              return (
                                <CheckComponent
                                  key={item.key}
                                  checked={checkedList.includes(item.key)}
                                  value={item}
                                />
                              );
                            })()}
                          </div>
                        </td>
                        {columnsOpts.map((col: ColumnsType) => {
                          return (
                            <td key={col.key} className="virtual-table-cell">
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
        </div>
      </div>
    </ResizeObserver>
  );
};

export default IndexPage;
