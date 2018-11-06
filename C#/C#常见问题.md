# C#常见问题
---

## 一、C#关键字ref和out的用法
##### 1.一个函数中，使用out或ref作为形参前的关键字，那么在函数体中只要修改过这个形参，之前调用这个函数时赋给对应形参的实参的值也会修改。(就是说不用在函数中return就可以改变相应的实参的值，而且类型可以不一样)

##### 2.out和ref的区别：out不需要对传入的参数赋值，函数中会先把参数清空，然后在函数中对参数赋值（在函数中必需对参数赋值）；ref必需先对传入的参数赋值，然后函数中对参数赋不赋值都行。

##### 3.总的来讲，out就是无进有出，ref就是有进有出(或无出)。

#### 4.ref示例：
```C#
class Program
{
    static void Main(string[] args)
    {
        Program pg = new Program();
        int x =0;
        int y = 0;
        pg.getnull(ref x, ref y);//这里x,y必须为已经赋过初值的，否则编译不通过
        Console.WriteLine("x=" + x + ",y=" + y);//输出为：x=0,y=0,原值没有改变，因为是空方法
        pg.GetValue(ref x, ref y);//这里x,y已经赋过初值的
        Console.WriteLine("x=" + x + ",y=" + y);//输出为：x=1,y=2
        Console.ReadLine();

    }
    public void getnull(ref int x, ref int y)
    {

    }
    public void GetValue(ref int x, ref int y)
    {
        x++;
        y = y + 2;
    }
    
} 

```
#### 5.out示例：
```C#
class Program
{
    static void Main(string[] args)
    {
        Program pg = new Program();
        int x =0;
        int y = 0;
        pg.getnull(out x,out y);//这里x,y不需要赋初值，赋了也没关系，但会清零；注意：** 调用函数时必须写关键字out ** 因为参数与关键字是一起传递的
        Console.WriteLine("x=" + x + ",y=" + y);//输出为：x=3,y=3,原值没有改变，因为是空方法

        pg.GetValue(out x, out y);//这里x,y已经赋过初值的
        Console.WriteLine("x=" + x + ",y=" + y);//输出为：x=12,y=21
        Console.ReadLine();

    }

    public void getnull(out int x, out int y)//如果函数体中没有给x,y赋初值（即下面函数体为空），那么编辑器会提示“控制离开当前方法之前必须对out参数x赋初值”，编译不通过
    {
        x = 3;//这里我们赋值，不赋值编译不通过
        y = 3;
    }
    public void GetValue(out int x, out int y)
    {
        //x++;//同样如果这么写会提示“使用了未赋值的out参数 x”，所以不可以这么直接 x++
        //y = y + 2;//同上

        //我们改为下边写法，就可以编译通过
        x = 12;
        y = 12;
    //这个函数和getnull的功能就完全相同了
    }
}
```

## 参考资料
#### 1. [C#中的关键字out是什么意思？ref是什么意思？它们有什么区别？](https://blog.csdn.net/sinat_23079759/article/details/52895385) 

