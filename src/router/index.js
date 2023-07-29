import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *  
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  confirm: true                if set true, when close or refresh this tag, it will get a confirm
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 所有权限通用路由表
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '工作台', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/Settlement',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '结算', icon: 'Settlement' },
    children: [{
      path: 'StoreIncomeSettlement',
      name: 'StoreIncomeSettlement',
      component: () => import('@/views/Settlement/StoreIncomeSettlement/index'),
      meta: { title: '门店收入结算' }
    }, {
      path: 'FabricSupplierSettlement',
      name: 'FabricSupplierSettlement',
      component: () => import('@/views/Settlement/FabricSupplierSettlement/index'),
      meta: { title: '面料商结算' }
    }, {
      path: 'FactorySettlement',
      name: 'FactorySettlement',
      component: () => import('@/views/Settlement/FactorySettlement/index'),
      meta: { title: '工厂结算' }
    }]
  },
  {
    path: '/CustomerManagement',
    component: Layout,
    redirect: '/CustomerManagement/index',
    meta: { title: '客户管理', icon: 'CustomerManagement' },
    children: [{
      path: 'index',
      name: 'CustomerManagement',
      component: () => import('@/views/CustomerManagement/index'),
      meta: { title: '客户管理', icon: 'CustomerManagement', breadcrumb: false },
    },
    {
      path: 'detail/:id(\\d+)',
      component: () => import('@/views/CustomerManagement/detail'),
      name: 'CustomerManagement-Detail',
      meta: { title: '客户详情', activeMenu: '/CustomerManagement/index' },
      hidden: true
    }]
  },
  {
    path: '/SupplyChain',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '供应链', icon: 'SupplyChain' },
    children: [{
      path: 'FabricSupplier',
      name: 'FabricSupplier',
      component: () => import('@/views/SupplyChain/FabricSupplier/index'),
      meta: { title: '面料商' }
    }, {
      path: 'Factory',
      name: 'Factory',
      component: () => import('@/views/SupplyChain/Factory/index'),
      meta: { title: '工厂' }
    }, {
      path: 'Costs',
      name: 'FactoryCosts',
      component: () => import('@/views/SupplyChain/Factory/costs'),
      meta: { title: '制造费用', activeMenu: '/SupplyChain/Factory' },
      hidden: true
    }]
  },
  {
    path: '/FabricManagement',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '面料管理', icon: 'FabricManagement' },
    children: [{
      path: 'BrandManagement',
      name: 'BrandManagement',
      component: () => import('@/views/FabricManagement/BrandManagement/index'),
      meta: { title: '品牌管理' }
    }, {
      path: 'FabricManagement',
      name: 'FabricManagement',
      component: () => import('@/views/FabricManagement/FabricManagement/index'),
      meta: { title: '面料管理' }
    }]
  },
  {
    path: '/FinishedProductManagement',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '成品管理', icon: 'FinishedProductManagement' },
    children: [
      // 款式管理、成品管理、出入库记录、采购订单、调拨订单、发货记录、收货记录
      {
        path: 'StyleManage',
        name: 'StyleManage',
        component: () => import('@/views/FinishedProductManagement/StyleManage/index'),
        meta: { title: '款式管理' }
      },
      {
        path: 'FinishedProductManage',
        name: 'FinishedProductManage',
        component: () => import('@/views/FinishedProductManagement/FinishedProductManage/index'),
        meta: { title: '成品管理' }
      },
      {
        path: 'AddFinishedProduct',
        component: () => import('@/views/FinishedProductManagement/FinishedProductManage/add'),
        name: 'AddFinishedProduct',
        meta: { title: '新增成品', activeMenu: '/FinishedProductManagement/FinishedProductManage' },
        hidden: true
      },
      {
        path: 'EditFinishedProduct/:id(\\d+)',
        component: () => import('@/views/FinishedProductManagement/FinishedProductManage/edit'),
        name: 'EditFinishedProduct',
        meta: { title: '编辑成品', activeMenu: '/FinishedProductManagement/FinishedProductManage' },
        hidden: true
      },
      {
        path: 'EntryExitRecords',
        name: 'EntryExitRecords',
        component: () => import('@/views/FinishedProductManagement/EntryExitRecords/index'),
        meta: { title: '出入库记录' }
      },
      {
        path: 'PurchaseOrder',
        name: 'PurchaseOrder',
        component: () => import('@/views/FinishedProductManagement/PurchaseOrder/index'),
        meta: { title: '采购订单' }
      },
      {
        path: 'TransferOrder',
        name: 'TransferOrder',
        component: () => import('@/views/FinishedProductManagement/TransferOrder/index'),
        meta: { title: '调拨订单' }
      },
      {
        path: 'AddTransferOrder',
        component: () => import('@/views/FinishedProductManagement/TransferOrder/add'),
        name: 'AddTransferOrder',
        meta: { title: '发起调拨', activeMenu: '/FinishedProductManagement/TransferOrder' },
        hidden: true
      },
      {
        path: 'ShippingRecord',
        name: 'ShippingRecord',
        component: () => import('@/views/FinishedProductManagement/ShippingRecord/index'),
        meta: { title: '发货记录' }
      },
      {
        path: 'ReceivingRecords',
        name: 'ReceivingRecords',
        component: () => import('@/views/FinishedProductManagement/ReceivingRecords/index'),
        meta: { title: '收货记录' }
      },
    ]
  },
  {
    path: '/CustomizedProducts',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '定制产品', icon: 'CustomizedProducts' },
    children: [{
      path: 'OrderManagement',
      name: 'OrderManagement',
      component: () => import('@/views/CustomizedProducts/OrderManagement/index'),
      meta: { title: '订单管理' }
    },
    {
      path: 'Details/:id(\\d+)',
      component: () => import('@/views/CustomizedProducts/OrderManagement/Details'),
      name: 'OrderDetails',
      meta: { title: '订单详情', activeMenu: '/CustomizedProducts/OrderManagement' },
      hidden: true
    },
    {
      path: 'CommissionManagement',
      name: 'CommissionManagement',
      component: () => import('@/views/CustomizedProducts/CommissionManagement/index'),
      meta: { title: '佣金管理 ' }
    }, {
      path: 'CustomizedProducts',
      name: 'CustomizedProducts',
      component: () => import('@/views/CustomizedProducts/CustomizedProducts/index'),
      meta: { title: '定制产品 ' }
    },
    {
      path: 'processParams/:id(\\d+)',
      component: () => import('@/views/CustomizedProducts/CustomizedProducts/processParams'),
      name: 'processParams',
      meta: { title: '工艺参数', activeMenu: '/CustomizedProducts/CustomizedProducts' },
      hidden: true
    },
    {
      path: 'processOption',
      component: () => import('@/views/CustomizedProducts/CustomizedProducts/processOption'),
      name: 'processOption',
      meta: { title: '工艺选项', activeMenu: '/CustomizedProducts/CustomizedProducts' },
      hidden: true
    },
    {
      path: 'volumeParams/:id(\\d+)',
      component: () => import('@/views/CustomizedProducts/CustomizedProducts/volumeParams'),
      name: 'volumeParams',
      meta: { title: '量体参数', activeMenu: '/CustomizedProducts/CustomizedProducts' },
      hidden: true
    },
    {
      path: 'PricingSystem',
      name: 'PricingSystem',
      component: () => import('@/views/CustomizedProducts/PricingSystem/index'),
      meta: { title: '定价体系 ' }
    }, {
      path: 'SpecialParameters',
      name: 'SpecialParameters',
      component: () => import('@/views/CustomizedProducts/SpecialParameters/index'),
      meta: { title: '特体参数 ' }
    },
    {
      path: 'SpecialOption',
      component: () => import('@/views/CustomizedProducts/SpecialParameters/SpecialOption'),
      name: 'SpecialOption',
      meta: { title: '特体参数选项', activeMenu: '/CustomizedProducts/SpecialParameters' },
      hidden: true
    },]
  },
  {
    path: '/MiniProgram',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '小程序', icon: 'MiniProgram' },
    children: [{
      path: 'AdvertisementManagement',
      name: 'AdvertisementManagement',
      component: () => import('@/views/MiniProgram/AdvertisementManagement/index'),
      meta: { title: '广告管理' }
    },
    {
      path: 'ContentManagement',
      name: 'ContentManagement',
      component: () => import('@/views/MiniProgram/ContentManagement/index'),
      meta: { title: '内容管理 ' }
    },
    {
      path: 'Article/:id(\\d+)/:name',
      component: () => import('@/views/MiniProgram/ContentManagement/Article'),
      name: 'Article',
      meta: { title: '文章列表', activeMenu: '/MiniProgram/ContentManagement' },
      hidden: true
    },
    {
      path: 'AddArticle/:ArtID(\\d+)/:name',
      component: () => import('@/views/MiniProgram/ContentManagement/AddArticle'),
      name: 'AddArticle',
      meta: { title: '新增文章', activeMenu: '/MiniProgram/ContentManagement' },
      hidden: true
    },
    {
      path: 'EditArticle/:ArtID(\\d+)/:id(\\d+)/:name',
      component: () => import('@/views/MiniProgram/ContentManagement/EditArticle'),
      name: 'EditArticle',
      meta: { title: '编辑文章', activeMenu: '/MiniProgram/ContentManagement' },
      hidden: true
    },
    {
      path: 'EventManagement',
      name: 'EventManagement',
      component: () => import('@/views/MiniProgram/EventManagement/index'),
      meta: { title: '活动管理 ' }
    },
    {
      path: 'AddEvent',
      component: () => import('@/views/MiniProgram/EventManagement/add'),
      name: 'AddEvent',
      meta: { title: '新增活动', activeMenu: '/MiniProgram/EventManagement' },
      hidden: true
    },
    {
      path: 'EditEvent/:id(\\d+)',
      component: () => import('@/views/MiniProgram/EventManagement/edit'),
      name: 'EditEvent',
      meta: { title: '编辑活动', activeMenu: '/MiniProgram/EventManagement' },
      hidden: true
    }]
  },
  {
    path: '/Account',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '账号', icon: 'Account' },
    children: [
      {
        path: 'StoreManagement',
        name: 'StoreManagement',
        component: () => import('@/views/Account/StoreManagement/index'),
        meta: { title: '门店管理' }
      },
      {
        path: 'SettingStore/:id(\\d+)/:name',
        component: () => import('@/views/Account/StoreManagement/SettingStore'),
        name: 'SettingStore',
        meta: { title: '门店配置', activeMenu: '/Account/StoreManagement' },
        hidden: true
      },
      {
        path: 'AccountManagement',
        name: 'AccountManagement',
        component: () => import('@/views/Account/AccountManagement/index'),
        meta: { title: '账号管理 ' }
      }]
  },
  {
    path: '/PaymentMethodManagement',
    component: Layout,
    redirect: '/PaymentMethodManagement/index',
    children: [{
      path: 'index',
      name: 'PaymentMethodManagement',
      component: () => import('@/views/PaymentMethodManagement/index'),
      meta: { title: '支付方式管理', icon: 'PaymentMethodManagement' },
    }]
  },
  {
    path: '/DataCenter',
    component: Layout,
    redirect: '/DataCenter/index',
    children: [{
      path: 'index',
      name: 'DataCenter',
      component: () => import('@/views/DataCenter/index'),
      meta: { title: '数据中心', icon: 'DataCenter' },
    }]
  },
  {
    path: '/SystemCenter',
    component: Layout,
    redirect: '/SystemCenter/index',
    meta: { title: '系统中心', icon: 'SystemCenter' },
    children: [{
      path: 'index',
      name: 'SystemCenter',
      component: () => import('@/views/SystemCenter/index'),
      meta: { title: '系统中心', icon: 'SystemCenter', breadcrumb: false },
    },
    {
      path: 'Upgradation',
      name: 'Upgradation',
      component: () => import('@/views/SystemCenter/Upgradation'),
      meta: { title: '系统升级', activeMenu: '/SystemCenter/index' },
      hidden: true
    }]
  },
]

// 异步挂载的路由
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()


export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
