# Lite-cli

这是一个分模块打包工具。通过读取项目中配置的module.config.json配置的模块文件，选取需要打包的模块，然后将该模块写入到package.json文件中。

```json
   package.json
   
   ....
   "modules": [
        "area_line",
        "histogram",
        "stack_bar",
        "bar",
        "two_way_bar"
    ]
    ....
```

可以通过bat批处理命令执行打包，将打包好的文件copy到指定目录。需要注意的是，由于执行打包的npm命令是调用外部程序执行的，所以需要加上一些处理。例如：

```bash
cd E:\worker\client\insight-bi
@echo off
call npm run build:prod
echo Exit Code = %ERRORLEVEL%
if "%ERRORLEVEL%" == "1" exit /B 1
xcopy /E  E:\worker\client\insight-bi\dist  F:/
```

**一、工具安装**

1、执行npm run build在dist目录生成工具打包后的文件。

2、执行npm link将命令链接到全局。

**二、工具打包配置**

1、配置模块配置文件，模块配置文件名称为module.config.json。示例文件在工具目录下：

```
/data/module.config.json
```

   如果需要将模块配置成树结构，示例文件：

```shell
/data/cp.module.config.json
```

   注意：模块描述对象type属性必须唯一，对于非模块节点则不需要type属性。

2、配置执行命令。命令示例文件：

```/data/bat/demo.bat
/data/bat/demo.bat
```

**三、工具运行**

1、可以在任意目录下运行命令启动打包工具。

```
lite-cli
```

2、默认在命令执行目录中读取模块配置文件。如果填写了执行路径，则从路径下开始执行。

**四、工具内部存储的临时文件**

1、执行命令时生成的bat文件目录。

```
/data/bat/
```

2、命令执行产生的日志目录。

```
/data/log/
```

3、存储打包工程被选择的模块目录。

```
/data/projects/
```

