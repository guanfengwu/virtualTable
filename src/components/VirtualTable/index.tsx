/*
 * @Author: WGF
 * @Date: 2023-01-29 13:42:55
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-02 20:13:31
 * @FilePath: \umi\src\components\VirtualTable\index.tsx
 * @Description: 文件描述
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

  const [selectedValue, setSelectedValue] = useState<string[]>(selectValue);

  useEffect(() => {
    if (selectionType === 'checkbox') {
      setSelectedValue(selectValue);
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
          selectValue={selectedValue}
          setSelectedValue={setSelectedValue}
          onChange={onChange}
        />
      </div>
    );
  };

  const components = useMemo(
    () => ({
      header: {
        cell: ResizableTitle,
      },
      body: {
        wrapper: renderVirtualList,
      },
    }),
    [dataSource, selectedValue],
  );

  /**
   * 不同选择模式下需要传的参数
   */
  const checkboxParam: any = useMemo(() => {
    if (selectionType === 'checkbox') {
      return {
        rowSelection: {
          type: 'checkbox',
          onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
            setSelectedValue(selectedRowKeys);
            if (selectedRowKeys.length === 0) {
              dataSource.forEach((item: any) => onChange(item));
            }
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
  }, [selectionType, selectedValue, dataSource]);

  return (
    <Table
      dataSource={dataSource}
      {...checkboxParam}
      columns={columnsOpts}
      showHeader={showHeader}
      pagination={false}
      components={components}
    />
  );
};
export default IndexPage;
