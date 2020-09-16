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

