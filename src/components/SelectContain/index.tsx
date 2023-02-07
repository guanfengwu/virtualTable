/*
 * @Author: WGF
 * @Date: 2023-01-31 09:52:36
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 11:09:19
 * @FilePath: \umi\src\components\SelectContain\index.tsx
 * @Description: 文件描述
 */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Select, Spin, Button } from 'antd';
import type { SelectProps } from 'antd';
import { debounce } from 'lodash-es';
import './index.less';
import classnames from 'classnames';
// import Nominate from '@/components/Nominate';
export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps, 'options' | 'children' | 'onSelect'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  searchPanel: ReactNode; // 搜索后展示面板
  nominatePanel: ReactNode; // 历史及推荐面板
  setSourceData: Function; // 重置搜索后的面板数据
  selectionType: 'checkbox' | 'radio'; // 选择模式(单选或多选)
  onRef: any;
  onSelect?: (select: string[], selectItem?: any) => void; // 应用组件的回调
  selectValue: string[]; // 提交选中的值
  setSelectValue: Function; // 提交选中值的方法
}

const IndexPage: React.FC<DebounceSelectProps> = (props) => {
  const {
    searchPanel,
    nominatePanel,
    setSourceData,
    fetchOptions,
    selectionType,
    onRef,
    onSelect,
    selectValue,
    setSelectValue,
  } = props;
  const [data, setData] = useState<any[]>([]); // 设置option的数据
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索的关键词(字符串格式)
  const [fetching, setFetching] = useState(false); // 当前是否为搜索状态
  const [open, setOpen] = useState(false); // 当前下拉菜单的状态
  const fetchRef = useRef(0); // 搜索防抖用的
  const selectRef = useRef<any>(); // 获取Select选择框
  const checkboxModeSelectData = useRef<any>([]); // 记录多选模式下选择的数据
  useImperativeHandle(onRef, () => {
    return {
      handleSelect,
      handleChange,
      searchValue,
      setData,
      confirmOk,
    };
  });
  /**
   * 防抖搜索
   */
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      if (Boolean(value) === false) {
        return;
      }
      setSearchValue(value);
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setData([]);
      setFetching(true);
      fetchOptions(value).then((res) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setData(res);
        setSourceData(res);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 500);
  }, [fetchOptions, selectionType]);

  /**
   * 数组对象去重方法
   * @param arr
   * @returns
   */
  const deWeight = (arr: any) => {
    let obj: any = {};
    return arr.reduce((item: any, next: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-constant-binary-expression
      obj[next.key] ? '' : (obj[next.key] = true && item.push(next));
      return item;
    }, []);
  };

  /**
   * 多选情况下取消选中某一行时去除之前选中的结果
   * @param changed
   */
  const handleChange = (changed: any) => {
    checkboxModeSelectData.current = checkboxModeSelectData.current.filter(
      (item: any) => item.key !== changed.key,
    );
  };

  /**
   *点击每一行选项执行的逻辑
   * @param newValue
   */
  const handleSelect = (newValue: string[], newValueItem: any) => {
    if (selectionType === 'radio') {
      setSelectValue(newValue);
      if (newValue !== selectValue) {
        onSelect?.(newValue, newValueItem);
        setOpen(false);
      }
    } else {
      checkboxModeSelectData.current = deWeight([
        ...checkboxModeSelectData.current,
        ...newValueItem,
      ]);
    }
  };
  /**
   * 多选模式下点击确认按钮
   */
  const confirmOk = () => {
    if (checkboxModeSelectData.current.length > 2000) {
      console.log('选择项不建议超过2000，请重新选择!!!');
      return;
    }
    const keys = checkboxModeSelectData.current.map((item: any) => item.key);
    onSelect?.(keys, checkboxModeSelectData.current);
    setSelectValue(keys);
    setOpen(false);
  };
  /**
   * 根据不同选择模式渲染页面
   */
  const renderSearchPanel: ReactNode = useMemo(() => {
    return (
      <div className="panui-virtual-selector-searchPanel">
        <div className="panui-virtual-selector-searchPanel-header">
          <div>全部</div>
          <div
            onClick={() => {
              debounceFetcher(searchValue);
            }}
          >
            刷新
          </div>
        </div>
        <div className="panui-virtual-selector-searchPanel-content">
          {searchPanel}
        </div>
        {selectionType === 'checkbox' && (
          <div className="panui-virtual-selector-searchPanel-footer">
            <Button type="primary" size="small" onClick={confirmOk}>
              确定
            </Button>
          </div>
        )}
      </div>
    );
  }, [searchPanel, open, selectionType]);
  /**
   * 公共下拉内容渲染
   * @param originNode
   * @returns
   */
  const dropdownRender = (originNode: ReactNode) => {
    return (
      <div className="panui-virtual-selector-dropdownPanel">
        {searchValue === '' ? (
          nominatePanel
        ) : fetching ? (
          <Spin size="small" />
        ) : (
          renderSearchPanel
        )}
      </div>
    );
  };

  /**
   * 不同选择模式下需要传的参数
   */
  const checkboxParam: SelectProps = useMemo(() => {
    if (selectionType === 'checkbox') {
      return {
        mode: 'multiple',
        allowClear: true,
        onChange: (newValue, newValueItems) => {
          setSelectValue(newValue);
          checkboxModeSelectData.current = newValueItems;
          onSelect?.(newValue, newValueItems);
        },
        maxTagCount: 'responsive',
      };
    } else {
      return {};
    }
  }, [selectionType]);
  return (
    <Select
      {...checkboxParam}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      ref={selectRef}
      value={selectValue}
      style={{ width: '100%' }}
      placeholder="请输入关键字进行搜索"
      showSearch={true}
      showArrow={true}
      filterOption={false}
      onSearch={debounceFetcher}
      dropdownRender={dropdownRender}
      popupClassName={classnames(['panui-virtual-selector-dropdown'])}
      options={(data || []).map((d) => ({
        key: d.key,
        value: d.key,
        label: d.name,
      }))}
    />
  );
};
export default IndexPage;
