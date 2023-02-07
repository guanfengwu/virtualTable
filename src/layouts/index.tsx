/*
 * @Author: WGF
 * @Date: 2023-01-18 11:08:39
 * @LastEditors: WGF
 * @LastEditTime: 2023-02-07 11:02:01
 * @FilePath: \umi\src\layouts\index.tsx
 * @Description: 文件描述
 */
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'umi';
import './index.less';

const { Header, Content, Footer } = Layout;
const menuData = [
  { route: 'section1', name: '原理' },
  { route: 'section3', name: '表格' },
  { route: 'section2', name: '搜索' },
];

function BasicLayout(props: { location: { pathname: any }; children: any }) {
  const {
    location: { pathname },
    children,
  } = props;

  return (
    <Layout>
      <Header>
        <div className="logo">Umi </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          style={{ lineHeight: '44px' }}
        >
          {menuData.map((menu) => (
            <Menu.Item key={`/${menu.route}`}>
              <Link to={menu.route}>{menu.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
}
export default BasicLayout;
