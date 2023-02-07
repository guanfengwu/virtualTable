/*
 * @Author: WGF
 * @Date: 2023-01-31 10:46:09
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 10:55:17
 * @FilePath: \umi\src\pages\Section2\components\NormalSearch\index.tsx
 * @Description: 满足大数据量情况下的普通搜索
 */ import React, { useCallback, useMemo, useRef, useState } from 'react';
import SelectContain from '@/components/SelectContain';
import VirtualTable from '@/components/VirtualTable';
import Nominate from '@/components/Nominate';

const IndexPage: React.FC<{
  fetchOptions: (keyWord: string) => any; // 数据请求
  selectionType?: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  onSelect?: (select: any, selectItem?: any) => void; // 获取当前提交选中后的值
  showHeader?: boolean; // 是否展示表头
  columns: any[]; // 列配置
}> = (props) => {
  const {
    fetchOptions,
    selectionType = 'radio',
    onSelect,
    showHeader = true,
    columns,
  } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectValue, setSelectValue] = useState<string[]>([]); // 选中后的值
  const searchRef = useRef<any>(null);

  const onSelected = (selected: any[], selectedItem: any[]) => {
    searchRef.current.handleSelect(selected, selectedItem);
  };
  const onChanged = (changed: any) => {
    searchRef.current.handleChange(changed);
  };
  /**
   * 向历史及面板传递的方法(设置options)
   * @param data
   */
  const setOptionsData = (data: Object[]) => {
    searchRef.current.setData(data);
  };
  /**
   * 向历史及面板传递的方法(提交选中项)
   * @param selected
   * @param selectedItem
   */
  const nominateSetSelected = (selected: any[], selectedItem: any[]) => {
    onSelected(selected, selectedItem);
    if (selectionType === 'checkbox') {
      searchRef.current.confirmOk();
    }
  };
  return (
    <div>
      <SelectContain
        selectionType={selectionType}
        fetchOptions={fetchOptions}
        setSourceData={setDataSource}
        onRef={searchRef}
        onSelect={onSelect}
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        searchPanel={
          <VirtualTable
            dataSource={dataSource}
            columns={columns}
            selectionType={selectionType}
            onSelect={onSelected}
            selectDefault={selectValue}
            onChange={onChanged}
            showHeader={showHeader}
            keyWord={searchRef.current?.searchValue}
            style={{ width: '700px' }}
          />
        }
        nominatePanel={
          <Nominate
            historyData={[
              { key: '2010', name: '国家石油' },
              { key: '2011', name: '国家电网' },
            ]}
            nominateData={[
              {
                key: '2012',
                name: '中国石油股份公司中国石油股份公司中国石油股份公司中国石油股份公司中国石油股份公司中国石油股份公司',
              },
              { key: '2010', name: '国家石油' },
            ]}
            onSelected={nominateSetSelected}
            setOptionsData={setOptionsData}
            style={{ width: '480px' }}
          />
        }
      />
    </div>
  );
};

export default IndexPage;
