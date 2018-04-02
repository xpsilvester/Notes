# JsAlgorithm
JS的常用算法练习  

[1.初级算法-线性查找-时间复杂度O(n)](#1.初级算法-线性查找-时间复杂度O(n))
  

[2.二分查找(又称折半查找) - 适用于已排好序的线性结构 - 时间复杂度O(logN)](#2.二分查找(又称折半查找) - 适用于已排好序的线性结构 - 时间复杂度O(logN))

[3.冒泡排序 -- 时间复杂度O(n^2)](#3.冒泡排序)

[4.选择排序 -- 时间复杂度O(n^2)](#4.选择排序)

[5.插入算法 -- 时间复杂度O(n^2)](#5.插入算法)

[6.字符串反转 -- 时间复杂度O(logN)](#6.字符串反转)

[7.一个基于对象的单链表](#7.一个基于对象的单链表)

[8.用数组实现的队列：利用数组中的push和shift方法可以使队列的实现显得非常简单、从定义一个Queue构造函数开始实现队列](8.用数组实现的队列)

[9.栈的实现](#9.栈的实现)

[10.快速排序 -- 平均时间复杂度O(nlog2n)](#10.快速排序)
## 1.初级算法-线性查找-时间复杂度O(n)--相当于算法界中的HelloWorld
```JavaScript
var arr = new Array(1,2,10,9,5);

//线性搜索
//A为数组，x为要搜索的值
function linearSearch(A,x){
	for(var i=0;i<A.length;i++){
		if(A[i]==x){
			return i;
		}
	}
	return false;
}
document.write(linearSearch(arr,10)+"</br>");
```
## 2.二分查找(又称折半查找) - 适用于已排好序的线性结构 - 时间复杂度O(logN)
```JavaScript
//二分搜索
//A为已按"升序排列"的数组，x为要查询的元素
//返回目标元素的下标
var arr1 = new Array(1,2,10,19,25);
function binarySearch(A, x){
	var low = 0, high = A.length - 1;
	while(low<=high){
		var mid=Math.floor((low+high)/2);//下取整
		if(A[mid]==x){
			return mid;
		}else if(A[mid]>x){
			high=mid-1;
		}else{
			low=mid+1;
		}
	}
	return false;
}
document.write(binarySearch(arr1,19)+"</br>");
```
## 3.冒泡排序 -- 时间复杂度O(n^2)
```JavaScript
var arr2 = new Array(1,2,10,9,5);
function bubbleSort(A){
	var i,j,flag,temp;
	for(i=A.length-1;i>=1;i--){
		flag=0;
		for(j=1;j<=i;j++){
			if(A[j-1]>A[j]){
				temp=A[j];
				A[j]=A[j-1];
				A[j-1]=temp;
				flag=1;
			}		
		}
		if(flag==0)
				return;
	}
}
/*
function bubbleSort(A) {
  for (var i = 0; i < A.length; i++) {
    var sorted = true;
  //注意：内循环是倒着来的
    for (var j = A.length - 1; j > i; j--) {
      if (A[j] < A[j - 1]) {
        var temp=A[j];
        A[j]=A[j-1];
        A[j-1]=temp;
        sorted = false;
      }
    }
    if (sorted) {
      return;
    }
  }
}
*/
bubbleSort(arr2);
	for(var k=0;k<arr2.length;k++){
		document.write(arr2[k]+",");
	}
```
## 4.选择排序 -- 时间复杂度O(n^2)
```JavaScript

//思路：找到最小值的下标记下来，再交换
function selectionSort(A){
	for(var i=0;i<A.length;i++){
		var k=i;
		//这个是算法的关键，它从无序序列中挑出一个最小的元素
		for(j=i+1;j<A.length;j++){
			if(A[k]>A[j])
				k=j;
		}
		//下面3句完成最小元素与无序序列第一个元素的交换
		var temp=A[i];
		A[i]=A[k];
		A[k]=temp;
	}
}
var arr3=[14,35,25,12,64,33];
selectionSort(arr3);
document.write("</br>");
for(var i=0;i<arr3.length;i++)
document.write(arr3[i]+",");
document.write("</br>");
```
## 5.插入算法 -- 时间复杂度O(n^2)
   
   假定当前元素之前的元素已经排好序，先把自己的位置空出来，然后前面比自己大的元素依次向后移，直到空出一个"坑"，然后把目标元素插入"坑"中每趟将一个待排序的元素作为关键字，按照其关键字值的大小插入到已经排好的部分序列的适当位置，直到插入完成

``JavaScript
function insertSort(A){
	for(var i=1;i<A.length;i++){//数组从下标0开始存储，第一个元素有序，所以从第二个开始处理
		var temp=A[i];//将待插入元素暂存于temp中
		var j=i-1;
		//下面这个循环完成了从待排元素之前的元素开始扫描，如果大于待排元素，则后移一位
		while(j>=1&&temp<A[j]){
			A[j+1]=A[j];
			j--;
		}
		A[j+1]=temp;
	}
}
arr4=[45,342,45634,664,656,34342,46,56,544];
insertSort(arr4);
for(var i=0;i<arr4.length;i++)
document.write(arr4[i]+",");
document.write("</br>");
```

## 6.字符串反转 -- 时间复杂度O(logN)

字符串反转(比如：ABC -> CBA) 可以直接用str.split("").reverse().join("")
``JavaScript
var str='ABC';
function reverse(s){
	var a=s.split('');//把‘ABC’分成子串数组['A','B','C']
	var i=0,j=a.length-1;
	while(i<j){
		var temp=a[i];
		a[i]=a[j];
		a[j]=temp;
		i++;
		j--;
	}
	return a.join('');//把字符串重新组合
}
var k=reverse(str);
document.write(k);
document.write("</br>");
```
## 7.设计一个基于对象的单链表（双链表类似）

需要设计两个类，Node 类用来表示节点, LinkedList 类提供插入节点、删除节点、显示列表元素的方法,以及其他一些辅助方法。

```JavaScript
//Node类：
function Node(element){
	this.data=element;//当前节点的数据 
	this.next=null;//下一个节点数据
	//this.previous = null;(双链表)
}
//LinkedList类
function LList(){
	this.head=new Node("head");//头节点 
}
//链表的操作
LList.prototype={
	//查找某一节点
	find:function(item){
		var currNode=this.head;
		while(currNode.data!=item){
			currNode=currNode.next;
		}
		return currNode;
	},
	//向某一元素后面插入新节点
	insert:function(newElement,item){
		var newNode=new Node(newElement);
		var current=this.find(item);
		newNode.next=current.next;
		current.next=newNode;
		//newNode.previous = current;(双链表)
	},
	//查找某一节点的前一个节点(前驱)
	findPrevious:function(item){
		var currNode=this.head;
		//从头结点开始找，一直到当前结点的next==item是返回当前结点
		while (!(currNode.next == null) &&(currNode.next.element != item)) {
			currNode=currNode.next;
		}
		return currNode;
	},
	//删除某一个节点
	remove:function(item){
		var prevNode=this.findPrevious(item);
		if (!(prevNode.next == null)){
			prevNode.next = prevNode.next.next; 
			/*(双链表)
			currNode.previous.next = currNode.next;  
    		currNode.next.previous = currNode.previous;  
    		currNode.next = null;  
    		currNode.previous = null;  */
		}    
	},
	//修改某一节点的数据
	edit:function(item,newItem){
		var curNode=this.find(item);
		curNode.data=newItem;
	},
	//在控制台打印出所有节点(为了方便预览)
	print:function(){
		var currNode=this.head;
		while (!(currNode.next == null)){
			console.log(currNode.next.data);    
      		currNode = currNode.next;
		}
	}
}
//测试链表
//新建链表
var names=new LList();
names.insert("likek", "head");//往头节点后插入节点likek  
names.insert("zhangsan", "likek");//往likek后插入节点zhangsan  
names.insert("lisi", "zhangsan");//往zhangsan后插入节点lisi  
names.insert("wangwu", "lisi");//往lisi后插入节点wangwu  
names.print(); 
console.log("****************************");
//移除结点
names.remove("zhangsan");//删除zhangsan节点
names.print();
console.log("****************************");
//更改结点
names.edit("lisi","wangnima");//将lisi节点改为wangnima
names.print();
console.log("****************************");

```

## 8.用数组实现的队列：利用数组中的push和shift方法可以使队列的实现显得非常简单
```JavaScript
var name1=[];
name1.push("wuxinpei");//推入元素
name1.push("zhangjionghuan");
name1.push("suguojing");
console.log(name1);//输出数组
console.log(name1.join());//输出字符串
name1.shift();//出队
console.log(name1.join());
console.log("****************************");
```

## 8.1从定义一个Queue构造函数开始实现队列

```JavaScript
function Queue(){
	this.dataStore=[];
}
Queue.prototype={
	enqueue:function　(element) {  
　　　this.dataStore.push(element);//入队，加入新成员  
　},  
  dequeue:function(){  
     return this.dataStore.shift();//删除并返回队首元素  
  },  
  front:function(){  
     return this.dataStore[0];//返回队首元素  
  },  
  back:function(){  
     return this.dataStore[this.dataStore.length-1];//返回队尾元素  
  },  
  toString:function(){  
     return this.dataStore.join();//返回队列中所有元素  
  },  
  isempty:function(){  
     return !this.dataStore.length;//判断队列是否为空  
  }  
}
//测试队列
var ui=new Queue();  
ui.enqueue("same");  
ui.enqueue("哈哈");  
ui.enqueue(26);  
console.log(ui.toString());//"likek,哈哈,18"
console.log("****************************");  
/*ui.dequeue();//"likek"  
ui.toString();//"likek,哈哈"  
ui.isempty();//false  
ui.dequeue();ui.dequeue();  
ui.isempty();//true 
*/

```

## 9.栈的实现：从定义一个stack构造函数开始

```JavaScript
function Stack() {  
　this.dataStore = [];//保存栈内元素  
　this.top = 0;  
}  
//对栈的各种操作 
Stack.prototype={  
   push:function push(element) {  
          this.dataStore[this.top++] = element;//添加一个元素并将top+1  
        },  
   peak:function peak() {  
          return this.dataStore[this.top-1];//返回栈顶元素  
        },  
   pop:function pop() {  
          return this.dataStore[--this.top];//返回栈顶元素并将top-1  
       },  
   clear:function clear() {  
           this.top = 0;//将top归0  
         },  
   length:function length() {  
            return this.top;//返回栈内的元素个数  
          }  
}  
//测试：
var lk=new Stack();  
lk.push("likeke");  
lk.push("zhangsan");  
lk.push("wangwu");   
lk.length();//3 
console.log(lk.peak()); 
lk.pop();//"wangwu"  
lk.clear();  
lk.length();//0  

```

## 10.快速排序--交换排序和递归--平均复杂度O(nlog2n)

```JavaScript
arr5=[49,38,65,97,76,13,27];
function quickSort(arr,l,r){//对从arr[l]到arr[r]的元素进行排序
	var temp,i=l,j=r;
	if(i<j){
		temp=arr[i];
		while(i!=j){
			while(i<j&&arr[j]>temp){//从右往左扫描到一个小于temp的元素
				j--;
			}
			if(i<j){
				arr[i]=arr[j];//把j的元素放在i的位置上（temp的左边）
				i++;//i右移一位
			}
			while(i<j&&arr[i]<temp){//从左往右扫描找到一个大于temp的元素
				i++;
			}
			if(i<j){
				arr[j]=arr[i];//把i的元素放在j的位置上(temp的右边)
				j--;
			}
		}
		arr[i]=temp;//将temp放在最终位置
		quickSort(arr,l,i-1);//递归地对temp左边的元素进行排序
		quickSort(arr,i+1,r);//递归地对temp右边的元素进行排序
	}
}
quickSort(arr5,0,6);
console.log(arr5);
```




