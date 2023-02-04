/*
 * @Author: WGF
 * @Date: 2023-01-29 13:42:55
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-03 16:09:02
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

const IndexPage: React.FC<{
  dataSource: any;
  columns: any;
  selectionType: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  showHeader?: boolean; // 是否展示表头
  onSelect: Function;
  selectValue: string[];
  onChange: Function;
}> = (props) => {
  const {
    dataSource,
    columns,
    selectionType,
    onSelect,
    selectValue,
    onChange,
    showHeader = true,
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
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const selectedValueRef = useRef<string[]>(selectValue);
  useEffect(() => {
    setSelectedValue(selectValue);
  }, [selectValue]);
  useEffect(() => {
    if (selectionType === 'checkbox') {
      selectedValueRef.current = selectValue;
    }
  }, [selectValue]);
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

  const ResizableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;
    if (width === undefined) {
      return <th {...restProps}></th>;
    }
    return (
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps}></th>
      </Resizable>
    );
  };

  const renderVirtualList = () => {
    return (
      <div style={{ height: '280px' }}>
        <VirtualTableBody
          dataSource={dataSource}
          columns={columnsOpts}
          selectionType={selectionType}
          visibleHeight={280}
          onSelect={onSelect}
          selectValue={selectedValueRef.current}
          setSelectedValue={setSelectedValue}
          onChange={onChange}
        />
      </div>
    );
  };

  const renderTableHeader = useMemo(() => {
    return {
      cell: ResizableTitle,
    };
  }, [selectedValue]);

  const renderTableBody = useMemo(() => {
    return {
      wrapper: renderVirtualList,
    };
  }, [selectedValueRef.current, columnsOpts]);

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
              selectedValueRef.current = [];
              dataSource.forEach((item: any) => onChange(item));
            } else {
              selectedValueRef.current = dataSource.map(
                (item: any) => item.key,
              );
            }
            setSelectedValue(selectedRowKeys);
          },
          selectedRowKeys: selectedValue,
        },
      };
    } else {
      return {
        rowSelection: {
          type: 'radio',
        },
      };
    }
  }, [selectionType, selectValue, selectedValue]);

  return (
    <Table
      dataSource={dataSource.slice(0, 100)}
      {...checkboxParam}
      columns={columnsOpts}
      showHeader={showHeader}
      pagination={false}
      components={{
        header: renderTableHeader,
        body: renderTableBody,
      }}
    />
  );
};
export default IndexPage;
