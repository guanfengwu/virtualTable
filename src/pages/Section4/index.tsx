/*
 * @Author: WGF
 * @Date: 2023-02-07 15:46:53
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-08 17:27:03
 * @FilePath: \umi\src\pages\Section4\index.tsx
 * @Description: 文件描述
 */
import VTable from '@/components/VTable';
const IndexPage: React.FC<{}> = () => {
  const dataSource = Array.from(Array(10000), (item, index) => ({
    key: `key${index + 1}`,
    code: `code${index + 1}`,
    name: `name${index + 1}`,
    other: `other${index + 1}`,
  }));
  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 350 },
    // { title: '其他', dataIndex: 'other', key: 'other', width: 100 },
  ];
  const onChange = (item: any) => {
    console.log(item);
  };
  const onSelect = (keys: any[], items: any) => {
    console.log(keys, items);
  };
  return (
    <div style={{ width: '50%' }}>
      <VTable
        columns={columns}
        dataSource={dataSource}
        visibleHeight={280}
        selectionType="radio"
        onChange={onChange}
        onSelect={onSelect}
      />
    </div>
  );
};

export default IndexPage;
