# 说明

基于 https://github.com/PanJiaChen/vue-admin-template release 4.4.0 版本修改：

1. 添加 tagsView（src/settings.js 可设置是否启用），并新增`关闭左边`和`关闭右边`功能

2. 修正原版 tagsView 存在的问题：`关闭其他`或者`关闭所有`时会触发 `affix: true` 的标签也重新刷新

3. router 新增 `confirm` 选项（关闭或者刷新标签时是否弹出确认框），详见 src/router/index.js 注释

4. src/settings.js 新增 `openedMenu` 设置（默认打开的左侧导航）

5. 实验性的加入 `vue-aplayer` 实现音乐播放器（src/settings.js 可设置是否启用）

**注意事项：使用 tagsView 时需要注意 router 设置 name 的值必须和相应的 vue 组件的 name 相同，否则
keep-alive 功能会失效，即每次点击已打开的 tag 都会触发刷新**


# 模板
https://github.com/leffss/vue-admin-template-4.4.0-tagsview

# 权限 
https://blog.csdn.net/SKY_PLA/article/details/122301579

# vue中表格或者内容区域高度自适应 
https://blog.csdn.net/weixin_47180815/article/details/121351516

# vue-admin-template 后台管理之权限管理，动态路由的实现
https://blog.csdn.net/weixin_43638800/article/details/109641584
https://juejin.cn/post/7047528276683653127

# 前端控制路由权限     node 12.20.0



主页
结算 Settlement
	门店收入结算  StoreIncomeSettlement
	面料商结算 FabricSupplierSettlement
	工厂结算 FactorySettlement
客户管理	 CustomerManagement
供应链 SupplyChain
	面料商 FabricSupplier
	工厂 Factory
面料管理	FabricManagement
	品牌管理 BrandManagement
	面料管理 FabricManagement

成品管理 FinishedProductManagement
定制产品  CustomizedProducts
	订单管理 OrderManagement
	佣金管理 CommissionManagement
	定制产品 CustomizedProducts
	定价体系 PricingSystem
	特体参数 SpecialParameters
小程序 MiniProgram
	广告管理 AdvertisementManagement
	内容管理 ContentManagement
	活动管理 EventManagement
账号 Account
	门店管理 StoreManagement
	账号管理 AccountManagement
支付方式管理 PaymentMethodManagement
数据中心 DataCenter
系统中心 SystemCenter

# 图表
npm install echarts --save   https://blog.csdn.net/weixin_43180359/article/details/103972649

# 控制台：event.js:94 [Violation] Added non-passive event listener to a scroll-blocking 'mousewheel' event. Consider marking event handler as 'passive' to make the page more responsive.

违反：没有添加被动事件监听器来阻止’touchstart’事件，请考虑添加事件管理者’passive’，以使页面更加流畅。
原因：Chrome51 版本以后，Chrome 增加了新的事件捕获机制－Passive Event Listeners；
Passive Event Listeners：就是告诉前页面内的事件监听器内部是否会调用preventDefault函数来阻止事件的默认行为，以便浏览器根据这个信息更好地做出决策来优化页面性能。当属性passive的值为true的时候，代表该监听器内部不会调用preventDefault函数来阻止默认滑动行为，Chrome浏览器称这类型的监听器为被动（passive）监听器。目前Chrome主要利用该特性来优化页面的滑动性能，所以Passive Event Listeners特性当前仅支持mousewheel/touch相关事件。
解决办法：npm i default-passive-events -S
main.js 中加入 import 'default-passive-events'

# Lodash
https://juejin.cn/post/7220274775913496613
npm install --save lodash

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

window.addEventListener('scroll', debounce(this.handleScroll, 200));
window.addEventListener('resize', throttle(this.handleResize, 500));
 
 // 防抖处理函数
handleScroll: debounce(function() {
	// 处理滚动事件
}, 200),

// 节流处理函数
handleResize: throttle(function() {
	// 处理窗口大小改变事件
}, 500)


destroyed() {
	// 在组件销毁前移除事件监听函数
	window.removeEventListener('scroll', debounce(this.handleScroll, 200));
	window.removeEventListener('resize', throttle(this.handleResize, 500));
}

# 完美监听一个div尺寸的改变(不论何种方式导致的尺寸变化)
https://www.jqhtml.com/63614.html

# 解决fixed 固定列错位bug
this.$refs.tableDataRef.doLayout();




# 正则验证
只能输入数字和小数点，最多两位小数
oninput="this.value = this.value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')"

只能输入数字
oninput="value=value.replace(/[^\d]/g,'')"
<el-input v-model="model.amount" type="text" oninput="value=value.replace(/[^\d.]/g,'')" placeholder="请输入总金额" />

手机号正则表达式：用于验证手机号格式是否正确。
const mobileReg = /^1[3456789]\d{9}$/;

邮箱正则表达式：用于验证邮箱格式是否正确。
const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

身份证号正则表达式：用于验证身份证号格式是否正确。
const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

数字正则表达式：用于验证字符串是否全部由数字组成。
const numberReg = /^\d+$/;

中文正则表达式：用于验证字符串是否全部由中文字符组成。
const chineseReg = /^[\u4e00-\u9fa5]+$/;

非空字符正则表达式：用于验证字符串是否为空或只包含空格。
const notEmptyReg = /\S+/;

# vue-element-admin、跳转详情页，添加面包屑，侧边栏不显示
修改 Breadcrumb / index
https://www.bilibili.com/read/cv22075416

# 富文本
https://blog.csdn.net/jia2799897415/article/details/125788747 

# 表单验证
brand: [
	{ required: true, message: '请选择品牌', trigger: 'change' }
],
fabricGroup: [
	{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
],
fabricNo: [
	{ required: true, message: '请输入面料号', trigger: 'blur' },
	{ pattern: /\S+/, message: '请输入面料号', trigger: 'blur' }
],
costPrice: [
	{ required: true, message: '请输入成本价', trigger: 'blur' },
]


# 文字内容超过宽度显示...
//一行
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
word-break: break-all;
//两行
text-overflow: -o-ellipsis-lastline;
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
line-clamp: 2;
-webkit-box-orient: vertical;

# 数字字母强制换行
word-wrap: break-word

# 关闭当前标签
// 调用全局挂载的方法，关闭当前页
this.$store.dispatch("tagsView/delView", this.$route);
// 关闭之后跳转你要跳转的路由
this.$router.push({ path: '/FinishedProductManagement/FinishedProductManage' })


# 拖拽 SortableJS npm install sortablejs --save
https://blog.csdn.net/XH_jing/article/details/120265576

row-key="id"
import Sortable from 'sortablejs'

this.$nextTick(() => {
	this.setSort()
})

// 表格拖拽排序
setSort() {
	const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]

	const sortable = new Sortable(el, {
	ghostClass: 'sortable-ghost', // 放置占位符的类名，
	setData: function (dataTransfer) {
		// 以避免Firefox错误
		// 详见 : https://github.com/RubaXa/Sortable/issues/1012
		dataTransfer.setData('Text', '')
	},
	onEnd: evt => {
		const targetRow = this.tableDataList.splice(evt.oldIndex, 1)[0]
		this.tableDataList.splice(evt.newIndex, 0, targetRow)

		// 请求排序接口
	}
	})
},

<style >
.dragTable .sortable-ghost td {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
.dragTable .el-table__body tr:hover > td {
  cursor: move;
}
</style>


# 打印 
	npm i vue-print-nb --save
	https://blog.csdn.net/qq_37494968/article/details/130931757
