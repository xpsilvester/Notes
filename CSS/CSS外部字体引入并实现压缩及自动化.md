# CSS外部字体引入并实现压缩及自动化
---

## 一、CSS引入自定义字体
#### 示例为SourceHanSansCNM字体
在CSS文件或 ```<style>``` 标签中添加：
```CSS
@font-face {
    font-family: 'SourceHanSansCNM';
    src: url('SourceHanSansCN-Medium.eot');
    src: local('SourceHanSansCNM'),
    	local('SourceHanSansCN-Medium'),
    	url('SourceHanSansCN-Medium.eot?#iefix') format('embedded-opentype'),
        url('SourceHanSansCN-Medium.woff') format('woff'),
        url('SourceHanSansCN-Medium.ttf') format('truetype'),
        url('SourceHanSansCN-Medium.svg#SingleMaltaRegular') format('svg');
    font-weight: normal;
    font-style: normal;
}
body{
   	font-size: 32px;
   	font-family: 'SourceHanSansCNM';
}
```
#### 字体后缀和浏览器有关，如下所示
* .TTF或.OTF，适用于Firefox 3.5、Safari、Opera 
* .EOT，适用于Internet Explorer 4.0+ 
* .SVG，适用于Chrome、IPhone 

#### *注意：下载的ttf或者otf文件转格式时可能会出错，最好多试几个转码工具或者多下几个ttf文件对比一下
字体库：[Google Font](https://github.com/google/fonts/tree/master/ofl)、[Font-Awesome](https://github.com/FortAwesome/Font-Awesome)
在线转码地址：[字客网](https://www.fontke.com/tool/convfont/)、[在线转换器](https://zh.fonts2u.com/font-converter.html)

## 二、使用Node.js工具Font-Spider（字蛛）压缩CSS引用字体
参考：https://blog.csdn.net/yueyemoyan/article/details/52004203
#### 1.原理
##### 英文字体文字部分由26个字母组成，所以字体文件通常不会太大；而中文汉字数量总共约有九万左右，国标(GB)字库 有6763字, 而根据《现代汉语常用字表》统计数据，常用汉字也要有3500个左右。中文字体文件通常都会几M的大小，参照现在中国的网络环境，显然不适合在项目中使用。
##### 字体文件过大严重影响了网页加载速度，对服务器的压力也很大
##### Font-Spider中文WebFont解决方案的诞生：
它是一个 web 字体工具，通过自动化技术来压缩、转码跨平台的中文字体，让网页自由嵌入中文字体成为可能。
主要原理是
a.爬行本地 html 文档，分析所有 css语句
b.记录@font-face语句声明的字体，并且记录使用该字体的 css 选择器
c.通过 css 选择器的规则查找当前 html 文档的节点，记录节点上的文本
d.找到字体文件并删除没被使用的字符
e.编码成跨平台使用的字体格式

web 中文字体演示与工具使用请前往主页：http://font-spider.org/

#### 2.使用
前提是已经安装了NodeJs，现在的前端没用NodeJs几乎不能工作，安装过程就不多说了，参考教程：http://www.runoob.com/nodejs/nodejs-install-setup.html

安装字蛛：
```node
D:\Documents and Settings\Desktop> npm install font-spider -g 
```
可能会出现一堆警告，可以无视，运行一下就知道行不行了，例如在D:\Documents and Settings\Desktop\SourceHanSansCN目录下有index.html,并在相应路径放好了ttf的字体源文件。
运行
```node
D:\Documents and Settings\Desktop> font-spider D:\Documents and Settings\Desktop\SourceHanSansCN\index.html 
```
也可以用通配符*.html直接扫描全部html文件
出现这个就成功了
![此处输入图片的描述][1]
在你原来的字体文件目录下会多出相应的压缩之后的字体文件，发现小了很多吧，然后你再引用相关的新的字体文件就行了

## 三、使用C#批量处理html文件的字体文件压缩，实现自动化

如果存在很多html需要压缩字体文件，一个一个地执行```font-spider```命令会很麻烦，现在写一个程序，可以实现自动检测文件夹的变化，当文件夹中有新的html加入时，自动运行```font-spider```进行字体文件压缩

#### 1.判断指定文件是否存在
```C#
string path = "D:/Documents and Settings/Desktop/SourceHanSansCN/index.html";
if (System.IO.File.Exists(path))
{
    Console.WriteLine("本地文件确实存在！");
}
else
{
    Console.WriteLine("本地文件不存在！"); 
}
```
#### 2.复制文件到指定目录 使用CopyTo方法
将soure路径中的 "SourceHanSansCN-Medium.ttf" 文件复制到finalRoute中
```C#
string source = @"D:/Documents and Settings/Desktop/SourceHanSansCN/source/SourceHanSansCN-Medium.ttf";
string finalRoute = @"D:/Documents and Settings/Desktop/SourceHanSansCN/SourceHanSansCN-Medium.ttf";
try
{
    FileInfo info = new FileInfo(source);
    info.CopyTo(finalRoute, true);
    Console.WriteLine("{0} copied to {1}", source, finalRoute);
    Console.WriteLine("The second Copy operation succeeded, which was expected.");
}
catch
{
    Console.WriteLine("Double copy is not allowed, which was not expected.");
}
```
#### 3.使用C#执行cmd命令
```C#
//要执行的cmd命令
//cmd 中的路径必须是双引号""
string strInput = "font-spider \"D:\\Documents and Settings\\Desktop\\SourceHanSansCN\\index.html\"";

Process pk = new Process();
//设置要启动的应用程序
pk.StartInfo.FileName = "cmd.exe";
//是否使用操作系统shell启动
pk.StartInfo.UseShellExecute = false;
// 接受来自调用程序的输入信息
pk.StartInfo.RedirectStandardInput = true;
//输出信息
pk.StartInfo.RedirectStandardOutput = true;
// 输出错误
pk.StartInfo.RedirectStandardError = true;
//不显示程序窗口
pk.StartInfo.CreateNoWindow = false;
//启动程序
pk.Start();

//向cmd窗口发送输入信息
pk.StandardInput.WriteLine(strInput + "&exit");

pk.StandardInput.AutoFlush = true;

//获取输出信息
string strOuput = pk.StandardOutput.ReadToEnd();
//等待程序执行完退出进程
pk.WaitForExit();
pk.Close();
Console.WriteLine(strOuput);
```
#### 4.监控文件夹内部变化
参考教程：[C#中监控文件夹的变化](https://blog.csdn.net/qq_26916435/article/details/70770325)
监控桌面的"SourceHanSansCN"文件夹中所有文件的变化
```C#
static void Main(string[] args)
{
    //调用WatcherStrat方法
   WatcherStrat(@"D:\Documents and Settings\Desktop\SourceHanSansCN", "*.*");
   Console.ReadKey();
}
public void WatcherStrat(string path, string filter)
{
   FileSystemWatcher watcher = new FileSystemWatcher();
   //文件路径
   watcher.Path = path;
   //文件过滤器，“*.*”则指定所有文件,"*.hmtl"则指定所有html文件
   watcher.Filter = filter;
   //加入文件改变，创建，删除，重命名方法
   watcher.Changed += new FileSystemEventHandler(OnProcess);
   watcher.Created += new FileSystemEventHandler(OnProcess);
   watcher.Deleted += new FileSystemEventHandler(OnProcess);
   watcher.Renamed += new RenamedEventHandler(OnRenamed);
   //对象在收到改变通知时提交事件
   watcher.EnableRaisingEvents = true;
   watcher.NotifyFilter = NotifyFilters.Attributes | NotifyFilters.CreationTime | NotifyFilters.DirectoryName | NotifyFilters.FileName | NotifyFilters.LastAccess
                          | NotifyFilters.LastWrite | NotifyFilters.Security | NotifyFilters.Size;
    //对象监控子目录中发生的改变
   watcher.IncludeSubdirectories = true;
}

private static void OnProcess(object source, FileSystemEventArgs e)
{
   if (e.ChangeType == WatcherChangeTypes.Created)
   {
       OnCreated(source, e);
   }
   else if (e.ChangeType == WatcherChangeTypes.Changed)
   {
       OnChanged(source, e);
   }
   else if (e.ChangeType == WatcherChangeTypes.Deleted)
   {
       OnDeleted(source, e);
   }

}
//创建时执行代码
private static void OnCreated(object source, FileSystemEventArgs e)
{
   Console.WriteLine("文件新建事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
}
//改变时执行代码
private static void OnChanged(object source, FileSystemEventArgs e)
{
   Console.WriteLine("文件改变事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
}
//删除时执行代码
private static void OnDeleted(object source, FileSystemEventArgs e)
{
   Console.WriteLine("文件删除事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
}
//重命名时执行代码
private static void OnRenamed(object source, RenamedEventArgs e)
{
   Console.WriteLine("文件重命名事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
}
```
#### 5.完整代码
#### *注意第14行的注释需要取消，由于md代码取消之后就没有高亮了，所以才加上的。
#### 以桌面上的“SourceHanSansCN”文件夹为例：
1.在“D:/Documents and Settings/Desktop/SourceHanSansCN/source/”文件夹中放入所需要的字体.ttf源文件
2.运行C#代码，在“SourceHanSansCN”文件夹中新建“xxxx”文件夹，名字随意
3.然后在“xxx”文件夹中添加"index.html"文件（必须是index.html），然后在index.html文件中插入第一点中的CSS代码,保存后，相应的地方就会自动打包压缩出相应的字体文件，完成自动化过程
```C#
class Spider
{
    static void Main(string[] args)
    {
        //调用WatcherStrat方法
        Spider spider = new Spider();
        spider.WatcherStrat(@"D:\Documents and Settings\Desktop\SourceHanSansCN", "*.html");
        Console.ReadKey();
    }
    public void autoExcute(string filePath)
    {
       //*下面这条注释需要取消，由于md代码取消之后就没有高亮了，所以才加上的

       //var file = filePath.Replace("index.html", "").Replace(@"\","/");
       string path = file + "index.html";
       string path1 = file + "SourceHanSansCN-Medium.ttf";
       string strInput = "font-spider " + "\"" + filePath + "\"";
       string spider = file + ".font-spider";
       string source = @"D:/Documents and Settings/Desktop/SourceHanSansCN/source/SourceHanSansCN-Medium.ttf";
       string finalRoute = file + "SourceHanSansCN-Medium.ttf";
       
       if (System.IO.File.Exists(path))
       {
           Console.WriteLine("本地文件确实存在！");
           try
           {
               FileInfo info = new FileInfo(source);
               info.CopyTo(finalRoute, true);
               Console.WriteLine("{0} copied to {1}", source, finalRoute);
               Console.WriteLine("The second Copy operation succeeded, which was expected.");
           }
    
           catch
           {
               Console.WriteLine("Double copy is not allowed, which was not expected.");
           }
           if (System.IO.File.Exists(path1))
           {
               Process pk = new Process();
               //设置要启动的应用程序
               pk.StartInfo.FileName = "cmd.exe";
               //是否使用操作系统shell启动
               pk.StartInfo.UseShellExecute = false;
               // 接受来自调用程序的输入信息
               pk.StartInfo.RedirectStandardInput = true;
               //输出信息
               pk.StartInfo.RedirectStandardOutput = true;
               // 输出错误
               pk.StartInfo.RedirectStandardError = true;
               //不显示程序窗口
               pk.StartInfo.CreateNoWindow = false;
               //启动程序
               pk.Start();
    
               //向cmd窗口发送输入信息
               pk.StandardInput.WriteLine(strInput + "&exit");
    
               pk.StandardInput.AutoFlush = true;
    
               //获取输出信息
               string strOuput = pk.StandardOutput.ReadToEnd();
               //等待程序执行完退出进程
               pk.WaitForExit();
               pk.Close();
               Console.WriteLine(strOuput);
               
               //删除文件夹.font-spider
               FileAttributes attr = File.GetAttributes(spider);
               if (attr == FileAttributes.Directory)
               {
                   Directory.Delete(spider, true);
               }
               else
               {
                   File.Delete(spider);
               }
    
           }
           else
           {
               Console.WriteLine("字体文件不存在无法格式化");
           }
       }
       else
       {
           Console.WriteLine("本地文件不存在！");
       }
    }
    
    public void WatcherStrat(string path, string filter)
    {
       FileSystemWatcher watcher = new FileSystemWatcher();
       watcher.Path = path;
       watcher.Filter = filter;
       watcher.Changed += new FileSystemEventHandler(OnProcess);
       watcher.Created += new FileSystemEventHandler(OnProcess);
       watcher.Deleted += new FileSystemEventHandler(OnProcess);
       watcher.Renamed += new RenamedEventHandler(OnRenamed);
       watcher.EnableRaisingEvents = true;
       watcher.NotifyFilter = NotifyFilters.Attributes | NotifyFilters.CreationTime | NotifyFilters.DirectoryName | NotifyFilters.FileName | NotifyFilters.LastAccess
                              | NotifyFilters.LastWrite | NotifyFilters.Security | NotifyFilters.Size;
       watcher.IncludeSubdirectories = true;
    }
    
    private static void OnProcess(object source, FileSystemEventArgs e)
    {
       if (e.ChangeType == WatcherChangeTypes.Created)
       {
           OnCreated(source, e);
       }
       else if (e.ChangeType == WatcherChangeTypes.Changed)
       {
           OnChanged(source, e);
       }
       else if (e.ChangeType == WatcherChangeTypes.Deleted)
       {
           OnDeleted(source, e);
       }
    
    }
    private static void OnCreated(object source, FileSystemEventArgs e)
    {
       Console.WriteLine("文件新建事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
       Spider spider = new Spider();
       spider.autoExcute(e.FullPath);
    }
    private static void OnChanged(object source, FileSystemEventArgs e)
    {
       Console.WriteLine("文件改变事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
       Spider spider = new Spider();
       spider.autoExcute(e.FullPath);
    }
    
    private static void OnDeleted(object source, FileSystemEventArgs e)
    {
       Console.WriteLine("文件删除事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
    }
    
    private static void OnRenamed(object source, RenamedEventArgs e)
    {
       Console.WriteLine("文件重命名事件处理类型：{0}，路径：{1}，文件或文件夹名称：{2}", e.ChangeType, e.FullPath, e.Name);
       Spider spider = new Spider();
       spider.autoExcute(e.FullPath);
    }
}
```

  [1]: http://7xio93.com1.z0.glb.clouddn.com/spide-img.png