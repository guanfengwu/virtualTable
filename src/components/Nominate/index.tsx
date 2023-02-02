/*
 * @Author: WGF
 * @Date: 2023-02-02 15:55:05
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-02 16:20:52
 * @FilePath: \umi\src\components\Nominate\index.tsx
 * @Description: 推荐收藏面板
 */

import styles from './index.less';
const IndexPage: React.FC<{}> = (props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.history}>
        <div className={styles.title}>历史</div>
        <div className={styles.h_content}>
          <div>选择菜单</div>
          <div>选择菜单</div>
          <div>选择菜单</div>
        </div>
      </div>
      <div className={styles.nominate}>
        <div className={styles.title}>推荐</div>
        <div className={styles.n_content}>
          <div>选择菜单</div>
          <div>选择菜单</div>
          <div>选择菜单</div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
