const isProduction = process.env.NODE_ENV === 'production';

module.exports =  {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
        '@typescript-eslint',
    ],
    parserOptions: {
        ecmaVersion: 2019,
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: './',
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    rules: {
        // react
        // 不使用 prop 验证
        'react/prop-types': 'off',

        // typescript
        // 允许使用任何类型
        '@typescript-eslint/ban-types': 'off',
        // 允许函数不写返回类型
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // 重载函数的定义必须是连续的
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        // 允许非空断言
        '@typescript-eslint/no-non-null-assertion': 'off',
        // 不允许对没有返回 Promise 的函数使用 await 运算符
        '@typescript-eslint/await-thenable': 'error',
        // 函数定义不需要强制指定返回值类型
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 允许使用显式的 any 类型
        '@typescript-eslint/no-explicit-any': 'off',
        // 类方法不需要写出 public 关键字
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        // 不限制数组类型定义的形式
        '@typescript-eslint/array-type': 'off',
        // 不强制驼峰
        '@typescript-eslint/camelcase': 'off',
        // 除了函数之外，禁止在定义之前使用变量
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        // 允许构造函数的重载
        '@typescript-eslint/no-useless-constructor': 'off',
        // 不强制使用 interface
        '@typescript-eslint/prefer-interface': 'off',
        // 调试时警告，生产时禁止未使用过的变量，在函数参数中，最后一个参数必须使用
        '@typescript-eslint/no-unused-vars': isProduction ? ['error', { 'vars': 'all', 'args': 'after-used' }] : 'warn',
        // 允许 namespace
        '@typescript-eslint/no-namespace': 'off',

        // common
        // 不允许扩展原生数据结构
        'no-extend-native': 'error',
        // 对于 debugger 语句，调试时允许，生产时不允许
        'no-debugger': isProduction ? 'error' : 'off',
        // 箭头表达式的括号不可省
        'arrow-parens': ['error', 'always'],
        // 箭头表达式前后空格
        'arrow-spacing': 'error',
        // 禁止在条件中使用常量表达式
        'no-constant-condition': 'error',
        // 生成器表达式 *号前有空格，后没有空格
        'generator-star-spacing': ['error', 'before'],
        // 表达式后必须有分号
        'semi': ['error', 'always'],
        // 不能存在多余的分号
        'no-extra-semi': 'error',
        // 允许存在不保存值的 new 表达式
        'no-new': 'off',
        // 默认退格为4个空格
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        // 声明可以不合并
        'one-var': 'off',
        // 函数名或 function 关键字之后与括号之间不需要空格，async 之后需要空格
        'space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
        // 代码块允许单独一行；多行代码时，起始大括号不换行，终止大括号独立成行
        'brace-style': ['error', 'stroustrup', { 'allowSingleLine': true }],
        // 允许在 if,for,while,do...while 的条件语句中赋值
        'no-cond-assign': 'off',
        // 允许等号前后有多个空格
        'no-multi-spaces' : 'off',
        // 禁用 alert、confirm 和 prompt
        'no-alert': 'off',
        // 禁用 arguments.caller 或 arguments.callee
        'no-caller': 'error',
        // 禁止使用类似 eval() 的方法
        'no-implied-eval': 'error',
        // 和 ts 的规则重复，禁用
        'no-undef': 'off',
        // 禁止将 undefined 作为标识符
        'no-undefined': 'off',
        // 除了函数之外，禁止在定义之前使用变量
        'no-use-before-define': ['error', 'nofunc'],
        // 禁止混合常规 var 声明和 require 调用
        'no-mixed-requires': 'off',
        // 禁止调用 require 时使用 new 操作符
        'no-new-require': 'error',
        // 禁止对 __dirname 和 __filename进行字符串连接
        'no-path-concat': 'off',
        // 逗号后空格，前不空格
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        // 以方括号取对象属性时，内部不需要空格
        'computed-property-spacing': ['error', 'never'],
        // 强制使用具名函数表达式
        'func-names': 'off',
        // 文件末尾强制换行
        'eol-last': 'error',
        // 不允许空格和 tab 混合缩进
        'no-mixed-spaces-and-tabs': 'error',
        // 禁用行尾空格
        'no-trailing-spaces':'error',
        // 关键字前后需要空格
        'keyword-spacing': 'error',
        // 禁用var
        'no-var': 'error',
        // 字符串全部为单引号
        'quotes': ['error', 'single'],
        // 变量未改变时强制使用 const
        'prefer-const': 'error',
        // 强制使用 ES6 缩写
        'object-shorthand': 'error',
        // 类继承的构造函数强制使用 super
        'constructor-super': 'error',
        // super之前禁止使用this
        'no-this-before-super': 'error',
        // 不强制驼峰
        'camelcase': 'off',
        // 对象末尾与另一个元素或属性的结尾处于不同的行时需要逗号，同一行时不需要
        'comma-dangle': ['error', 'always-multiline'],
        // 强制 getter/setter 成对出现在对象中 
        'accessor-pairs': 'error',
        // 强制在单行代码块中使用空格 
        'block-spacing': ['error', 'always'],
        // 强制在单行块内使用空格
        'comma-style': ['error', 'last'],
        // 允许单行代码块省略大括号
        'curly': ['error', 'multi-line'],
        // 允许点运算符换行，切不允许点运算符放在行末
        'dot-location': ['error', 'property'],
        // 除了和 null 比较之外，全部强制使用 === 和 !==
        'eqeqeq': ['error', "always", {"null": "ignore"}],
        // 事件完成回调时的 error 参数的名字
        'handle-callback-err': ['error', '^(err|error)$' ],
        // 在 jsx 中使用单引号
        'jsx-quotes': ['error', 'prefer-single'],
        // 对象字面量中，冒号和键之间不要空格，冒号和值之间需要空格
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
        // 使用 new 运算符的函数首字母必须大写；首字母大写的函数不一定需要 new 运算符
        'new-cap': ['error', { 'newIsCap': true, 'capIsNew': false }],
        // 使用 new 的构造函数必须带圆括号
        'new-parens': 'error',
        // 使用 Array 构造函数创建数组时，只允许单参数
        'no-array-constructor': 'error',
        // 不允许修改类声明的变量
        'no-class-assign': 'error',
        // 不允许修改 const 声明的变量
        'no-const-assign': 'error',
        // 禁止怼变量使用 delete 运算
        'no-delete-var': 'error',
        // 禁止函数声明中存在重名的变量
        'no-dupe-args': 'error',
        // 允许类成员中有重复的名称（这里主要是为了兼容类方法重载）
        'no-dupe-class-members': 'off',
        // 禁止在对象字面量中出现重复的键 
        'no-dupe-keys': 'error',
        // 禁止重复 case 标签
        'no-duplicate-case': 'error',
        // 禁止在正则表达式中出现空字符集 
        'no-empty-character-class': 'error',
        // 解构模式不允许为空
        'no-empty-pattern': 'error',
        // 禁用 eval()
        'no-eval': 'error',
        // 禁止对 catch 子句中的异常重新赋值
        'no-ex-assign': 'error',
        // 禁止不必要的函数绑定 bind
        'no-extra-bind': 'error',
        // 禁止不必要的布尔类型转换
        'no-extra-boolean-cast': 'error',
        // 禁止在 function 周围多余的括号
        'no-extra-parens': ['error', 'functions'],
        // 除最后一个外，禁止 case 语句落空（缺少return, break）
        'no-fallthrough': 'error',
        // 禁止浮点小数
        'no-floating-decimal': 'error',
        // 禁止对 function 声明的函数名重新赋值
        'no-func-assign': 'error',
        // 禁止在嵌套的语句块中出现 function 声明
        'no-inner-declarations': ['error', 'functions'],
        // 禁止在 RegExp 构造函数中出现无效的正则表达式
        'no-invalid-regexp': 'error',
        // 禁止不规则的空白
        'no-irregular-whitespace': 'error',
        // 禁用迭代器（这里并不是指ES6的迭代器）
        'no-iterator': 'error',
        // 禁用与变量同名的标签
        'no-label-var': 'error',
        // 在循环和 switch 语句之外，禁用标签语句
        'no-labels': ['error', { 'allowLoop': false, 'allowSwitch': false }],
        // 禁用不必要的嵌套块
        'no-lone-blocks': 'error',
        // 禁止多行字符串
        'no-multi-str': 'error',
        // 最多允许一个空行
        'no-multiple-empty-lines': ['error', { 'max': 1 }],
        // 禁止原生内置变量的重新赋值
        'no-global-assign': 'error',
        // 禁止不安全的 ! 运算
        'no-unsafe-negation': 'error',
        // 禁止使用 Object 构造函数来创建对象
        'no-new-object': 'error',
        // 禁止 Symbol 使用 new 运算符
        'no-new-symbol': 'error',
        // 使用 String, Number, Boolean 创建变量时禁止使用 new
        'no-new-wrappers': 'error',
        // 禁止将全局对象当作函数进行调用（比如 Math）
        'no-obj-calls': 'error',
        // 禁用八进制字面量
        'no-octal': 'error',
        // 禁止在字符串字面量中使用八进制转义序列
        'no-octal-escape': 'error',
        // 禁用 __proto__
        'no-proto': 'error',
        // 禁止重新声明变量
        'no-redeclare': 'error',
        // 禁止正则表达式字面量中出现多个空格
        'no-regex-spaces': 'error',
        // 禁止在返回语句中赋值，除非将赋值语句用括号括起来
        'no-return-assign': ['error', 'except-parens'],
        // 禁止自身赋值
        'no-self-assign': 'error',
        // 禁止自身比较
        'no-self-compare': 'error',
        // 关键字不能被遮蔽
        'no-shadow-restricted-names': 'error',
        // 函数调用时，函数名和括号之间不允许空格和换行
        'func-call-spacing': ['error', 'never'],
        // 禁用稀疏数组
        'no-sparse-arrays': 'error',
        // 抛出异常时必须使用 Error
        'no-throw-literal': 'error',
        // 不允许初始化变量值为 undefined 
        'no-undef-init': 'error',
        // 禁止使用令人困惑的多行表达式
        'no-unexpected-multiline': 'error',
        // 禁用一成不变的循环条件
        'no-unmodified-loop-condition': 'error',
        // 禁止可以表达为更简单结构的三元操作符
        'no-unneeded-ternary': 'error',
        // 禁止在 return、throw、continue 和 break 语句后出现不可达代码 
        'no-unreachable': 'error',
        // 禁止在 finally 语句块中出现控制流语句
        'no-unsafe-finally': 'error',
        // 关闭自带的未用变量检测
        'no-unused-vars': 'off',
        // 禁用不必要的 .call() 和 .apply()
        'no-useless-call': 'error',
        // 禁止对象中不必要的计算属性键
        'no-useless-computed-key': 'error',
        // 允许不必要的构造函数（这是为了兼容 ts 的构造函数重载）
        'no-useless-constructor': 'off',
        // 禁用不必要的转义
        'no-useless-escape': 'error',
        // 点运算前后禁止空白
        'no-whitespace-before-property': 'error',
        // 禁用 with 语句
        'no-with': 'error',
        // 换行符放在操作符后面，但是对于 ?, : ，操作符会放在它们俩之前
        'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
        // 禁止块内填充
        'padded-blocks': ['error', 'never'],
        // 强制分号前没有空格，强制分号后需要空格
        'semi-spacing': ['error', { 'before': false, 'after': true }],
        // 强制要求语句块之前的空格
        'space-before-blocks': ['error', 'always'],
        // 圆括号内前后不需要空格
        'space-in-parens': ['warn', 'never'],
        // 要求中缀操作符周围有空格
        'space-infix-ops': 'error',
        // 单词运算符后需要空格，符号一元运算符不需要
        'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
        // 注释符号后需要至少一个空格
        'spaced-comment': ['error', 'always', { 'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }],
        // 模板字符串中变量不允许存在空格
        'template-curly-spacing': ['error', 'never'],
        // 检查 NaN 必须使用 isNaN()
        'use-isnan': 'error',
        // 强制 typeof 表达式与有效的字符串进行比较
        'valid-typeof': 'error',
        // 立即执行的函数需要用括号包裹起来 
        'wrap-iife': ['error', 'inside'],
        // 在 yield* 表达式中， * 前面需要空格
        'yield-star-spacing': ['error', 'before'],
        // 禁用 yoda 风格
        'yoda': ['error', 'never'],
        // 禁止以对象元素开始或结尾的对象的花括号中有空格
        'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
        // 禁止在方括号前后使用空格
        'array-bracket-spacing': ['error', 'never'],
        // 允许使用 console
        'no-console': 'off',
    },
};
