/*
 * @Author: WGF
 * @Date: 2023-02-07 10:52:25
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 10:53:02
 * @FilePath: \umi\src\components\Nominate\index.tsx
 * @Description: 文件描述
 */

import React, { useEffect } from 'react';
import './index.less';
const IndexPage: React.FC<{
  historyData?: any[]; // 历史数据
  nominateData: any[]; // 推荐数据
  style?: any; // 自定义样式
  onSelected: Function;
  setOptionsData: Function;
}> = (props) => {
  const { historyData, nominateData, style, onSelected, setOptionsData } =
    props;
  useEffect(() => {
    if (historyData) {
      setOptionsData([...nominateData, ...historyData]);
    } else {
      setOptionsData(nominateData);
    }
  }, [nominateData, historyData]);
  return (
    <div className="panui-virtual-history-nominate" style={style}>
      {historyData && historyData.length > 0 && (
        <div className="panui-virtual-history">
          <div className="panui-virtual-title">历史</div>
          <div className="panui-virtual-h_content">
            {historyData.map((item) => (
              <div
                key={item.key}
                onClick={() => {
                  onSelected([item.key], [item]);
                }}
                className="panui-virtual-h_content-box"
              >
                {Object.values(item).toString().split(',').join(' ')}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="panui-virtual-nominate">
        <div className="panui-virtual-title">推荐</div>
        <div className="panui-virtual-n_content">
          {nominateData.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                onSelected([item.key], [item]);
              }}
              className="panui-virtual-n_content-box"
            >
              {Object.values(item).toString().split(',').join(' ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
