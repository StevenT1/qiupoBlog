---
title: 复习知识之---vue篇
author: Taoqiupo
date: 2022-02-09 13:56:20
tags: vue
category: 复习
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/20220209135658.png
---
### 首先应该记起的内容
最应该想起的应该就是vue的生命周期部分，这是贯穿开发从始至终的部分，贴一张官网的生命周期图：
![生命周期](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/20220209140454.png '生命周期')

&emsp;&emsp;在vue中，我最常使用的包括created,beforeMount,mounted,beforeDestory(最新部分已经改成beforeUnmount),destoryed(最新部分已修改成unmounted)。从图中也能很清晰的看到整个vue生命周期钩子触发的流程。那vue从`new Vue()`开始整个流程是如何进行的呢？
## vue解析
### 1.入口
&emsp;&emsp;首先我们到github上看一下Vue是如何被定义的：
*[src/core/instance/index.js](https://proxy.qiupo.workers.dev/?https://github.com/vuejs/vue/blob/dev/src/core/instance/index.js)*
```javascript
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
&emsp;&emsp;从上面可以发现，所谓的`new Vue()`其实只是做了一个`_init(options)`操作，那这个`_init`函数是从哪里来的呢？
PS：在这里不得不推荐一下Octotree这个插件，可以直接很便捷的找到这个方法是在哪里被定义了和被使用了
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/20220209150114.png '使用图片')

从工具中可以找到该方法定义在同级的init.js文件中，其中init方法是在initMixin初始化时创建的，并将_init方法挂载到Vue的原型上。

```typescript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```
&emsp;&emsp;从_init方法的执行顺序中可以发现以下代码段：
```javascript
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
```
&emsp;&emsp;仔细看看就能发现这一段先是初始化了一堆生命周期的标志符:
```javascript
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

```
然后初始化了事件监听

```javascript
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

let target: any

function add (event, fn) {
  target.$on(event, fn)
}

function remove (event, fn) {
  target.$off(event, fn)
}

function createOnceHandler (event, fn) {
  const _target = target
  return function onceHandler () {
    const res = fn.apply(null, arguments)
    if (res !== null) {
      _target.$off(event, onceHandler)
    }
  }
}
```
再然后初始化render方法和初始化依赖注入的内容，在这里调用了defineReactive方法
```javascript
export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
    toggleObserving(true)
  }
}
```
随后是重点内容，在initState中按照props，methods，data，computed，watch的顺序初始化了这些内容：
```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
&emsp;&emsp;从这里可以看出，在`beforeCreate`的时候好数据初始化还没开始，data，props的属性访问不到，然后在`created`的时候props，methods，data，computed，watch都初始化完成了，但是此时还没有发生mount所以虽然能拿到数据但是还无法访问dom元素。在最后，使用vm.$mount方法进行挂载。

### 2.挂载
&emsp;&emsp;在上面部分能看到整个初始化的流程，那mount是如何操作的呢？
```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
//.....
......//
}
```
从方法中可以看到最后是调用了`mountComponent`方法挂载组件的。进入`mountComponent`方法能看到他实在lifecycle文件中的。
```javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    //...
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
&emsp;&emsp;从代码里可以看到，在这里执行了`beforeMount`方法，在此之后定义了一个`updateComponent`方法，在随后`new Watcher`监听了当前组件的状态，如果有数据更新，就会触发`beforeUpdate`来进行更新操作，当`_isMounted`为true时，就会触发`mounted`的生命周期钩子了。

&emsp;&emsp;那在这里面有两个函数格外引人注目，一个是`_update`一个是`_render`，因为这两个都涉及了很有意思的部分，一个是涉及到dom的更新，一个涉及到虚拟dom的生成。直接下钻找到他们的实现位置：
+ _update
在代码中通过`setActiveInstance`保留当前作用域，然后使用`__patch__`去执行把vnode转成真实dom。在mount方法上一行就是`Vue.prototype.__patch__ = inBrowser ? patch : noop`，此时告诉我们patch方法的位置，追根溯源可以找到[patch.js](https://github.com/vuejs/vue/blob/23760b5c7a/src/core/vdom/patch.js)实现的位置，此处在vdom下，主要就是处理vnode的。
```javascript
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```
+ _render
render方法中通过vdom中的`createEmptyVNode`方法来创建vnode节点，然后设置父节点，再把此节点抛出。
```javascript
 Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```
### 3. lifecycle
| 生命周期 | 描述 |
| ----- | ---- | 
| beforeCreate | 执行时组件实例还未创建，通常用于插件开发中执行一些初始化任务 |
| created | 组件初始化完毕，各种数据可以使用，常用于异步数据获取 |
| beforeMount | 未执行渲染、更新，dom未创建 |
| mounted| 初始化结束，dom已创建，可用于获取访问数据和dom元素 |
| beforeUpdate| 更新前，可用于获取更新前各种状态 |
| updated| 更新后，所有状态已是最新 |
| beforeDestroy| 销毁前，可用于一些定时器或订阅的取消 |
| destroyed | 组件已销毁，作用同上 |

&emsp;&emsp;在上面内容中总能看到lifecycle，这也是生命周期的文件，这不得重点关注一下，然后在刚刚看到的`_update`后面一下就找到了一个急救的东西`$forceUpdate`.
```javascript
  Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
      vm._watcher.update()
    }
  }
  // watcher
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
    /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          const info = `callback for watcher "${this.expression}"`
          invokeWithErrorHandling(this.cb, this.vm, [value, oldValue], this.vm, info)
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```
`$forceUpdate`的作用是当数据刷新后视图却没有跟着刷新时的抢救措施，让他强制刷新一下。看代码中主要的行为就是使用了watcher中的update方法，所以`$forceUpdate`其实是会触发`beforeUpdate`和`updated`的，但是不会重新加载组件。
