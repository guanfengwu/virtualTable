import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import styles from './index.less';

const { Header, Content, Footer } = Layout;
const menuData = [
  { route: 'section1', name: '虚拟表格方案1' },
  { route: 'section2', name: '虚拟表格方案2' },
];

function BasicLayout(props: { location: { pathname: any; }; children: any; }) {
  const {
    location: { pathname },
    children,
  } = props;

  return (
    <Layout>
      <Header>
        <div className={styles.logo}>Umi </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          style={{ lineHeight: '64px' }}
        >
          {menuData.map(menu => (
            <Menu.Item key={`/${menu.route}`}>
              <Link to={menu.route}>{menu.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{children}</div>
      </Content>
    </Layout>
  );
}
export default BasicLayout;