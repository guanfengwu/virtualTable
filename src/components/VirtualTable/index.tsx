/*
 * @Author: WGF
 * @Date: 2023-01-29 13:42:55
 * @LastEditors: WGF
 * @LastEditTime: 2023-01-30 17:37:59
 * @FilePath: \umi\src\components\VirtualTable\index.tsx
 * @Description: 文件描述
 */
import React, { useMemo, useState } from 'react';
import { Table } from 'antd';
import VirtualTableBody from '../VirtualTableBody';
import { TableComponents } from 'rc-table/lib/interface';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const IndexPage: React.FC<{
  dataSource: any;
  columns: any;
}> = (props) => {
  const { dataSource, columns } = props;
  const [columnsOpts, setColumnsOpts] = useState<any>(
    columns?.map((col: any) => {
      col.onHeaderCell = () => ({
        width: col.width,
        onResize: handleResize(col),
      });
      return col;
    }),
  );

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
  const renderVirtualList = (props: any) => {
    return (
      <VirtualTableBody
        dataSource={dataSource}
        columns={columns}
        selectionType="checkbox"
      />
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
      // table: renderVirtualList,
    }),
    [],
  );

  return (
    <Table
      dataSource={dataSource}
      rowSelection={{
        type: 'checkbox',
      }}
      columns={columnsOpts}
      pagination={false}
      components={components}
    />
  );
};
export default IndexPage;
