/*
 * @Author: WGF
 * @Date: 2023-01-29 13:42:55
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 10:54:31
 * @FilePath: \umi\src\components\VirtualTable\index.tsx
 * @Description: 文件描述
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Table } from 'antd';
import VirtualTableBody from '../VirtualTableBody';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './index.less';
const IndexPage: React.FC<{
  dataSource: object[];
  columns: object[];
  selectionType: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  showHeader?: boolean; // 是否展示表头
  selectDefault?: string[]; // 当前选中的数据（key值)
  onSelect?: Function; // 点击行时触发的方法(获取到当前所有已选中的行数据)
  onChange?: Function; // 点击行时触发的方法(获取到当前点击的行数据)
  keyWord?: string; // 高亮的关键词
  style?: any; // 自定义样式
}> = (props) => {
  const {
    dataSource,
    columns,
    selectionType,
    onSelect,
    selectDefault,
    onChange,
    showHeader = true,
    keyWord,
    style,
  } = props;
  const [columnsOpts, setColumnsOpts] = useState<any>(
    columns?.map((col: any) => {
      col.onHeaderCell = () => ({
        width: col.width,
        onResize: handleResize(col),
      });
      return col;
    }),
  );
  const [selectedValue, setSelectedValue] = useState<string[]>(
    selectDefault || [],
  );
  const [headValue, setHeadValue] = useState<string[]>();

  // const selectedValueRef = useRef<string[]>(selectValue);
  useEffect(() => {
    if (selectionType === 'checkbox') {
      setSelectedValue(selectDefault || []);
    }
  }, [selectDefault]);
  // useEffect(() => {
  //   if (selectionType === 'checkbox') {
  //     selectedValueRef.current = selectValue;
  //   }
  // }, [selectValue]);
  const handleResize =
    (column: any) =>
    (e: any, { size }: any) => {
      const newColumnsOpts = columnsOpts.map((item: any, index: any) => {
        if (item === column) {
          item.width = size.width;
        }
        return item;
      });
      setColumnsOpts(newColumnsOpts);
    };

  // eslint-disable-next-line react/no-unstable-nested-components
  const ResizableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;
    if (width === undefined) {
      // eslint-disable-next-line react/self-closing-comp
      return <th {...restProps}></th>;
    }
    return (
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps} />
      </Resizable>
    );
  };

  const renderTableHeader = useMemo(() => {
    return {
      cell: ResizableTitle,
    };
  }, [selectedValue]);

  /**
   * 不同选择模式下需要传的参数
   */
  const checkboxParam: any = useMemo(() => {
    if (selectionType === 'checkbox') {
      return {
        rowSelection: {
          type: 'checkbox',
          onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
            if (selectedRowKeys.length === 0) {
              // selectedValueRef.current = [];
              dataSource.forEach((item: any) => {
                onChange?.(item);
              });
              setSelectedValue([]);
            } else {
              // selectedValueRef.current = dataSource.map(
              //   (item: any) => item.key,
              // );

              setSelectedValue(dataSource.map((item: any) => item.key));
            }
          },
          selectedRowKeys: headValue,
        },
      };
    } else {
      return {
        rowSelection: {
          type: 'radio',
        },
      };
    }
  }, [selectionType, headValue]);
  return (
    <div className="panui-virtual-table" style={style}>
      <Table
        dataSource={dataSource.slice(0, 1000)}
        {...checkboxParam}
        columns={columnsOpts}
        showHeader={showHeader}
        pagination={false}
        components={{
          header: renderTableHeader,
          body: {
            // eslint-disable-next-line react/no-unstable-nested-components, react/self-closing-comp
            wrapper: () => <tbody></tbody>,
          },
        }}
      />
      <VirtualTableBody
        dataSource={dataSource}
        columns={columnsOpts}
        selectionType={selectionType}
        visibleHeight={280}
        onSelect={onSelect}
        selectDefault={selectedValue}
        setHeadValue={setHeadValue}
        onChange={onChange}
        keyWord={keyWord}
      />
    </div>
  );
};
export default IndexPage;
