/*
 * @Author: WGF
 * @Date: 2023-01-31 10:46:09
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-02 19:39:43
 * @FilePath: \umi\src\pages\Section2\components\NormalSearch\index.tsx
 * @Description: 文件描述
 */
import SelectContain from '@/components/SelectContain';
import VirtualTable from '@/components/VirtualTable';
import { useCallback, useMemo, useRef, useState } from 'react';

const IndexPage: React.FC<{
  fetchOptions: (keyWord: string) => any; // 数据请求
  selectionType?: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  onSelect?: (select: any, selectItem?: any) => void; // 获取当前提交选中后的值
  showHeader?: boolean; // 是否展示表头
}> = (props) => {
  const {
    fetchOptions,
    selectionType = 'radio',
    onSelect,
    showHeader = true,
  } = props;
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectValue, setSelectValue] = useState<string[]>([]); // 选中后的值
  const searchRef = useRef<any>(null);
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name' },
  ];
  const setData = useCallback((item) => {
    setDataSource(item);
  }, []);
  const onSelected = (selected: any[], selectedItem: any[]) => {
    searchRef.current.handleSelect(selected, selectedItem);
  };
  const onChanged = (changed: any) => {
    searchRef.current.handleChange(changed);
  };
  return (
    <div>
      <SelectContain
        selectionType={selectionType}
        fetchOptions={fetchOptions}
        setSourceData={setData}
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
            selectValue={selectValue}
            onChange={onChanged}
            showHeader={showHeader}
          />
        }
      />
    </div>
  );
};

export default IndexPage;
