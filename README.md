# promise-generator-webpack

## promise

① npm install babel-loader -D
② npm install babel-preset-es2015 -D

> webpack.config.js如下：

```js
var join = require('path').join

module.exports = {
    entry:join(__dirname,'index.js'),
    output:{
        path:'./dist',
        publicPath:'dist/',
        filename:'bundle.js'
    },
    module:{
        loaders:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/,
                query:{
                    "presets":["es2015"]
                }
            }
        ]
    }
}
```

> index.js如下：

```js
window.onload = function() {
    new Promise((resolve, reject) => {
        setTimeout(function() {
            resolve('success')
        }, 1000)
    })
    .then(result => {
        alert(result)
    })
}
```

执行webpack,编译成功，但你会发现Promise依然坚挺的屹立在那里，打开babel-preset-es2015里边根本没有和Promise相关的文件。so...肯定还需要别的什么。

进入babel github 在搜索栏输入`promise`看看有什么，
```js
import _Promise from "babel-runtime/core-js/promise";
  _Promise.resolve;
```

看来babel-runtime可以给我一些线索，

③ npm install babel-runtime -D 

找到babel-runtime/core-js/promise，打开一看
```js
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
```
看来他有引用了一个叫`core-js`的一个包，牛！，Readme都没有...
顺藤摸瓜，找到了core-js/library/modules/es6.promise.js, 打开一看就是promise的es5实现了，既然这样install了babel-runtime就说明我们可以使用Promise了吗，too simple！，刚才webpack出来的代码根本就没有一个去引用这个`es6.promise.js`啊!，所以既然可以解析webpack中的Promise，那一定是babelrc配置项，还是在babel github的搜索结果中，看到一直在出现的一个叫babel-plugin-transform-runtime的插件，看下这个插件的介绍：

---
babel-plugin-transform-runtime
Externalise references to helpers and builtins, automatically polyfilling your code without polluting globals.

Why?

Babel uses very small helpers for common functions such as _extend. By default this will be added to every file that requires it. This duplication is sometimes unnecessary, especially when your application is spread out over multiple files.

This is where the runtime transformer plugin comes in: `all of the helpers will reference the module babel-runtime to avoid duplication across your compiled output. The runtime will be compiled into your build`.

Another purpose of this transformer is to create a sandboxed environment for your code. If you use babel-polyfill and the built-ins it provides such as Promise, Set and Map, those will pollute the global scope. While this might be ok for an app or a command line tool, it becomes a problem if your code is a library which you intend to publish for others to use or if you can't exactly control the environment in which your code will run.

The transformer will alias these built-ins to core-js so you can use them seamlessly without having to require the polyfill.

See the technical details section for more information on how this works and the types of transformations that occur.
---
看下突出的这行字，冰狗！，就是他来引用babel-runtime中的代码来解析Promise的。

④ npm install babel-plugin-transform-runtime -D 

修改我们的webpack.config.js中对babel的配置：
```js
query:{
    "presets":["es2015"],
    "plugins":["transform-runtime"]
}
```

我们再执行webpack，这次不一样了， `+ 66 hidden modules`

OK GET Promise!

## generator
搞定了Promse，那么我们再看看generator，这次我们直接上刚才的`webpack.config.js`
```js
var join = require('path').join

module.exports = {
    entry:join(__dirname,'index.js'),
    output:{
        path:'./dist',
        publicPath:'dist/',
        filename:'bundle.js'
    },
    module:{
        loaders:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/,
                query:{
                    "presets":["es2015"],
                    "plugins":["transform-runtime"]
                }
            }
        ]
    }
}
```

我们的index.js是这样的：
```js
window.onload = function() {
    function * genFn() {
        var ret1 = yield "something";
        var ret2 = yield new Promise((resolve, reject)=>{
            resolve(ret1);
        });
        yield console.log(ret2); //2. get Promise
        return "done";
    }

    var gener = genFn();
    var g1 = gener.next();
    console.log(g1.value);   //1. something
    var g2 = gener.next("success");
    g2.value.then(result=>{
        console.log(result); //4.success
    });
    var g3 = gener.next("get Promise")
    var g4 = gener.next()
    console.log(g4.value) //3. done
}
```
执行webpack, `+ 70 hidden modules`，这么牛不会一次成功了吧！运行下代码。
!!!成功打印出：something getPromise done success。

好了以后我们就可以在项目中愉快的使用Promise和Generator了，Async和Await还是等等吧：）
 