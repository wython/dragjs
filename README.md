使dom元素支持拖拽

### 引入
只需要将drag.js文件引入即可。如需兼容es5，自行用babel转换

```
//引入
import Drag from './drag';
```
或者
```
const Drag require('./drag').default;
```


### 使用

#### basic
```
//基本使用, 给target绑定移动事件, target可以是element的Id或者是dom element本身
new Drag(target)
	.start();
```

#### 钩子

```
new Drag(target)
    .on('beforeMove', (e) => {
	    //可以通过钩子在绑定class 名字从而改变样式
    })
    .on('moving', (e) => {
	    //
    })
    .on('moved', (e) => {
    })
    .start();
```

#### 父容器移动
```
//target为触发事件元素，container为移动的元素

new Drag(target)
	.addContainer(contariner)
	.start()
```

#### 可选options
```
const opts = {
	targetType:　'all',      //默认'all', 支持'x':沿x轴, 'y'：沿y轴, 'all'
	fixed: false             //默认false, 是否固定在页面
	top: null,
	left: null,              //初始位置，若不指定，则为元素本身所在位置
	container: 'containerId' //与addContainer方法相同作用
}
```

