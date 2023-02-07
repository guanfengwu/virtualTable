/*
 * @Author: WGF
 * @Date: 2023-02-06 15:37:43
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-06 20:44:49
 * @FilePath: \umi\src\pages\Section3\index.tsx
 * @Description: 文件描述
 */
import VirtualTable from '@/components/VirtualTable';
const IndexPage: React.FC<{}> = (props) => {
  const dataSource = Array.from(Array(800), (item, index) => ({
    key: `key${index + 1}`,
    code: `测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试Code${
      index + 1
    }`,
    name: `测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试Name${
      index + 1
    }`,
  }));

  const columns = [
    { title: '编号', dataIndex: 'code', key: 'code', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '其他', dataIndex: 'name', key: 'other' },
  ];

  const onSelected = (select: string[], selectItem: any[]) => {
    console.log(
      '调用----',
      '(选中的key值)',
      select,
      '(选中的对象)',
      selectItem,
    );
  };
  const onChanged = (selectItem: any[]) => {
    console.log('(选中的对象)', selectItem);
  };
  return (
    <div style={{ width: '500px' }}>
      <VirtualTable
        dataSource={dataSource}
        columns={columns}
        selectionType={'checkbox'}
        onSelect={onSelected}
        selectDefault={['key2']}
        onChange={onChanged}
      />
    </div>
  );
};
export default IndexPage;
