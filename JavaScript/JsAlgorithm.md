# JsAlgorithm
JS的常用算法练习  

[1.初级算法-线性查找-时间复杂度O(n)](#初级算法)
  

[2.二分查找(又称折半查找) - 适用于已排好序的线性结构 - 时间复杂度O(logN)](#二分查找)

[3.冒泡排序 -- 时间复杂度O(n^2)](#冒泡排序)

[4.选择排序 -- 时间复杂度O(n^2)](#选择排序)

[5.插入算法 -- 时间复杂度O(n^2)](#插入算法)

[6.字符串反转 -- 时间复杂度O(logN)](#字符串反转)

[7.一个基于对象的单链表](#一个基于对象的单链表)

[8.用数组实现的队列：利用数组中的push和shift方法可以使队列的实现显得非常简单、从定义一个Queue构造函数开始实现队列](#用数组实现的队列)

[9.JS使用队列对数组排列，基数排序算法](#JS使用队列对数组排列，基数排序算法)

[10.栈的实现](#栈的实现)

[11.二叉树的实现](#二叉树的实现)

[12.快速排序 -- 平均时间复杂度O(nlog2n)](#快速排序)

[13.两数之和](#两数之和)

[14.三数之和](#三数之和)
## 初级算法
### 线性查找-时间复杂度O(n)--相当于算法界中的HelloWorld
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
## 二分查找
### (又称折半查找) - 适用于已排好序的线性结构 - 时间复杂度O(logN)
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
## 冒泡排序
### 时间复杂度O(n^2)
```JavaScript
var arr2 = new Array(1,2,10,9,5);
//第一种
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
第二种
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
第三种（推荐:容易写，不容易出错）
function bubbleSort(arr){
	var flag=0;
	do{
		flag=1;
		for(var i=0 ; i<arr.length;i++){
			if(arr[i]>arr[i+1]){
				var temp=arr[i];
				arr[i]=arr[i+1];
				arr[i+1]=temp;
				flag=0;
            }
        }
	}
	while(flag==0)
}
*/
bubbleSort(arr2);
```
## 选择排序
### 时间复杂度O(n^2)
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
## 插入算法
### 时间复杂度O(n^2)
   
   假定当前元素之前的元素已经排好序，先把自己的位置空出来，然后前面比自己大的元素依次向后移，直到空出一个"坑"，然后把目标元素插入"坑"中每趟将一个待排序的元素作为关键字，按照其关键字值的大小插入到已经排好的部分序列的适当位置，直到插入完成

```JavaScript
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

## 字符串反转
### 时间复杂度O(logN)

字符串反转(比如：ABC -> CBA) 可以直接用str.split("").reverse().join("")
```JavaScript
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
## 设计一个基于对象的单链表
### （双链表类似）

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

## 用数组实现的队列
### 利用数组中的push和shift方法可以使队列的实现显得非常简单
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

## 从定义一个Queue构造函数开始实现队列

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

## JS使用队列对数组排列，基数排序算法

```JavaScript
/*
* 使用队列对数组排列，基数排序
*对于0~99的数字，基数排序将数组集扫描两次。
* 第一次按个位上的数字进行排序，
* 第二次按十位上的数字进行排序
* */
function Queue(){
  this.dataStore = [];//存放队列的数组，初始化为空
  this.enqueue = enqueue;//向队列尾部添加一个元素
  this.dequeue = dequeue;//删除队首的元素
  this.theFront = theFront;//读取队首的元素
  this.back = back;//对取队尾的元素
  this.toStrings = toStrings;//显示队列内的所有元素
  this.empty = empty;//判断队列是否为空
}
function enqueue(element){
  this.dataStore.push(element);
}
function dequeue(){
  return this.dataStore.shift();
}
function theFront(){
  return this.dataStore[0];
}
function back(){
  return this.dataStore[this.dataStore.length-1];
}
function toStrings(){
  return this.dataStore;
}
function empty(){
  if(this.dataStore.length == 0){
    return true;
  }else{
    return false;
  }
}
/*基数排序
* nums :需要排序的数组
* queues ：数组，里面元素是队列
* n ：队列的格式，这里为10个
* digit ：传入1，则先按个位上的数字排序；传入10，则按十位上的数字排序
 * */
function distribute(nums,queues,n,digit){
  for(var i = 0;i < n;i++){
    if(digit == 1){
      queues[nums[i]%10].enqueue(nums[i]);
    }else if(digit == 10){
      queues[Math.floor(nums[i]/10)].enqueue(nums[i]);
    }else{
    }
  }
}
function collect(queues,nums){
  var i = 0;
  for(var j = 0;j < 10;j++){
    while(!queues[j].empty()){
      nums[i++] = queues[j].dequeue();
    }
  }
}
/*测试程序*/
var queues = [];
for(var i = 0;i < 10;i++){
  queues[i] = new Queue();
}
var nums = [];
for(var i = 0;i < 10;i++){
  nums[i] = Math.floor(Math.random()*101);
}
console.log("开始的nums： "+nums);//24,72,90,84,49,69,8,30,50,0 (都是随机数，仅供参考)
distribute(nums,queues,10,1);
collect(queues,nums);
distribute(nums,queues,10,10);
collect(queues,nums);
console.log("排序后的nums： "+nums);//0,8,24,30,49,50,69,72,84,90 (都是随机数，仅供参考)
```


## 栈的实现
### 从定义一个stack构造函数开始

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

## 二叉树的实现
### 具体代码如下

```JavaScript
//Node节点
function Node(data,left,right){
	this.data = data;
	this.left = left;
	this.right = right;
	this.show = show;
}

//展示当前节点数据
function show(){
	return this.data;
}

//树结构
function BST(){
	this.root = null;
	this.insert = insert;
	this.inOrder = inOrder;
	this.getMin = getMin;
	this.getMax = getMax;
	this.find = find;
	this.remove = remove;
}

//插入节点操作
function insert(data){
	let n = new Node(data,null,null);
	if(this.root == null){
		this.root = n;
	}else{
		let current = this.root;
		let parent;
		while(current){
			parent = current;
			if(data < current.data){
				current = current.left;
				if(current == null){
					parent.left = n;
					break;
				}
			}else{
				current = current.right;
				if(current == null){
					parent.right = n
					break
				}
			}
		}
	}
}

//中序遍历
function inOrder(node){
	if(!(node == null)){
		inOrder(node.left);
		console.log(node.show());
		inOrder(node.right)
	}
}

//先序遍历
function preOrder(node){
	if(!(node == null)){
		console.log(node.show());
		preOrder(node.left);
		preOrder(node.right);
	}
}

//后序遍历
function postOrder(node){
	if(!(node == null)){
		postOrder(node.left);
		postOrder(node.right);
		console.log(node.show())
	}
}

//二叉树查找最小值
function getMin(){
	let current = this.root;
	while(!(current.left == null)){
		current = current.left
	}
	return current.data
}

//二叉树查找最大值
function getMax(){
	let current = this.root;
	while(!(current.right == null)){
		current = current.right
	}
	return current.data
}

//查找给定值
function find(data){
	let current = this.root;
	while(current != null){
		if(current.data == data){
			return current;
		}else if(data < current.data){
			current = current.left
		}else {
			current = current.right
		}
	}
	return null;
}

//移除节点
function remove(data){
	root = removeNode(this.root,data)
}

//获取右子树最小值
function getSmallest(node){
	if(node.left == null){
		return node;
	}else{
		return getSmallest(node.left)
	}
}

//移除节点操作
function removeNode(node,data){
	if(node == null){
		return null;
	}
	if(data == node.data){
		//没有子节点的节点
		if(node.left == null && node.right == null){
			return null;
		}
		//没有左子节点的节点
		if(node.left == null){
			return node.right;
		}
		//没有右子节点的节点
		if(node.right == null){
			return node.left;
		}
		// 有2个子节点的节点
		let tempNode = getSmallest(node.right);
		node.data = tempNode.data
		node.right = removeNode(node.right,tempNode.data);
		return node;
	}else if(data < node.data){
		node.left = removeNode(node.left,data);
		return node;
	}else{
		node.right = removeNode(node.right,data);
		return node;
	}
}

let nums = new BST();
nums.insert(23);
nums.insert(45);
nums.insert(16);
nums.insert(37);
nums.insert(3);
nums.insert(99);
nums.insert(22);

let min = nums.getMin();
console.log(min);

let max = nums.getMax();
console.log(max);

let value = nums.find("45");
console.log(value);

nums.remove(23);

```


## 快速排序
### 交换排序和递归--平均复杂度O(nlog2n)

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
## 两数之和

#### 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

```js
//给定 nums = [2, 7, 11, 15], target = 9

//因为 nums[0] + nums[1] = 2 + 7 = 9
//所以返回 [0, 1]
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let a = {}
    for(let i=0;i<nums.length;i++){
        let temp = target - nums[i]
        if(a[temp] != undefined) return [a[temp],i];
        a[nums[i]] = i
    }
    return []
};

```


## 三数之和
#### 给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。答案中不可以包含重复的三元组。
```js
//例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，

//满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
]

```
```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    let res = []
      let length = nums.length;
      nums.sort((a, b) => a - b) // 先排个队，最左边是最弱（小）的，最右边是最强(大)的
      if (nums[0] <= 0 && nums[length - 1] >= 0) { // 优化1: 整个数组同符号，则无解
        for (let i = 0; i < length - 2;) {
          if (nums[i] > 0) break; // 优化2: 最左值为正数则一定无解
          let first = i + 1
          let last = length - 1
          do {
            if (first >= last || nums[i] * nums[last] > 0) break // 两人选相遇，或者三人同符号，则退出
            let result = nums[i] + nums[first] + nums[last]
            if (result === 0) { // 如果可以组队
              res.push([nums[i], nums[first], nums[last]])
            }
            if (result <= 0 ) { // 实力太弱，把菜鸟那边右移一位
              while (first < last && nums[first] === nums[++first]){} // 如果相等就跳过
            } else { // 实力太强，把大神那边右移一位
              while (first < last && nums[last] === nums[--last]) {}
            }
          } while (first < last)
          while (nums[i] === nums[++i]) {}
        }
      }
      return res

};
```





