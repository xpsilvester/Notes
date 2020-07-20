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

[12.图的实现](#图的实现)

[13.快速排序 -- 平均时间复杂度O(nlog2n)](#快速排序)

[14.两数之和](#两数之和)

[15.三数之和](#三数之和)

[16.两数相加](#两数相加)

[17.合并两个有序链表](#合并两个有序链表)

[18.最大子序和](#最大子序和)

[19.背包问题](#背包问题)

[20.八皇后问题](#八皇后问题)

[21.全排列](#全排列)

[22.寻找数组中的第K个大数](#第K个大数)

[23.“最值”型问题典范：如何优雅地找硬币](#如何优雅地找硬币)

[24.最长上升子序列](#最长上升子序列)

[25.最长回文子串](#最长回文子串)

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
//层序遍历(广度优先搜索)：队列
function levelOrder(node){
  const printArr = []
  if (!root) return printArr
  const list = []
  list.push({ node: root, level: 0 })
  while (list.length > 0) {
    const { node, level } = list.shift()
    if (!printArr[level]) {
      printArr[level] = []
    }
    printArr[level].push(node.val)
    node.left && list.push({ node: node.left, level: level + 1 })
    node.right && list.push({ node: node.right, level: level + 1 })
  }
  return printArr
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

## 图的实现
```JavaScript
function Graph(v){
	this.vertices = v; //顶点的数量
	this.edges = 0
	this.adj = []
	for(let i=0;i<this.vertices;++i){
		this.adj[i] = []; //保存与顶点i相邻的顶点列表
	}
	this.addEdge = addEdge
	this.showGraph = showGraph
	this.dfs = dfs
	this.bfs = bfs
	this.marked = [] //保存未访问过的顶点
	for(let i=0;i<this.vertices;++i){
		this.marked[i] = false
	}
}

function addEdge(v,w){
	this.adj[v].push(w);
	this.adj[w].push(v);
	this.edges++;
}

function showGraph(){
	for(let i=0;i<this.vertices;++i){
		let str = '';
		str += i + ' -> ';
		for(let j= 0;j<this.vertices;++j){
			if(this.adj[i][j] != undefined){
				str += this.adj[i][j] + ' '
			}
		}
		console.log(str)
	}
}

//深度优先搜索
function dfs(v){
	this.marked[v] = true;
	if(this.adj[v] != undefined){
		console.log('Visited vertex: ' + v)
	}
	for(let w of this.adj[v]){
		if(!this.marked[w]){
			this.dfs(w)
		}
	}
}

//广度优先搜索
function bfs(s){
	let queue = []
	this.marked[s] = true
	queue.push(s) //添加到队尾
	while(queue.length > 0){
		let v = queue.shift(); //从队首移除
		if(v != undefined){
			console.log('Visited vertex: ' + v)
		}
		for(let w of this.adj[v]){
			if(!this.marked[w]){
				this.marked[w] = true;
				queue.push(w)
			}
		}
	}
}

let g = new Graph(5);
g.addEdge(0,1);
g.addEdge(0,2)
g.addEdge(1,3);
g.addEdge(2,4);
g.showGraph();
g.dfs(0)
g.bfs(0)
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
//方法一：
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

//方法二：
var threeSum = function(nums) {
    //排序
    nums = nums.sort((a,b) => a-b);
    let res = [],
        len = nums.length;

    for(let i=0;i<len -2;i++){
        let j = i+1, k = len -1;

        //固定元素大于0退出
        if(nums[i] > 0){
            break
        }
        //固定元素遇到重复跳过
        if(nums[i] == nums[i-1]){
            continue;
        }

        //左指针小于右指针，右指针不要小于0
        while(j < k && nums[k] >= 0){
            //三数之和
            let sum = nums[i] + nums[j] + nums[k];
            
            //等于0
            //加入结果数组
            //让左右指针继续移动
            if(sum === 0){
                res.push([nums[i],nums[j],nums[k]])
                j++;
                k--;
                //左指针遇重复跳过
                while(j < k && nums[j] == nums[j-1]){
                    j++
                }
                //右指针遇重复跳过
                while(j < k && nums[k] == nums[k+1]){
                    k--
                }
            }else if(sum > 0){ //大于0 ，右指针左移
                k--
                //右指针遇重复跳过
                while(j < k && nums[k] == nums[k+1]){
                    k--
                }
            }else{
                j++
                 //左指针遇重复跳过
                while(j < k && nums[j] == nums[j-1]){
                    j++
                }
            }
        }
    }
    return res
}
```

## 两数相加
#### 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
#### 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
#### 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：
```
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
```

```JavaScript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let p1 = l1
    let p2 = l2
    let carry = 0
    const dummy = new ListNode()
    let pointer = dummy
    while (p1 || p2 || carry) {
        const num1 = p1 ? p1.val : 0
        const num2 = p2 ? p2.val : 0
        const sum = num1 + num2 + carry
        if (sum > 9) {
			pointer.next = new ListNode(sum % 10)
			carry = 1
        } else {
			pointer.next = new ListNode(sum)
			carry = 0
        }
        if (p1) p1 = p1.next
        if (p2) p2 = p2.next
        pointer = pointer.next
    }
    return dummy.next
};

```

## 合并两个有序链表

#### 将两个有序链表合并为一个新的有序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
示例：
```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

```JavaScript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
     // 设置莫须有的头结点作为返回链表的头结点
    var prevHead = new ListNode(-1);
    // 利用js对象地址传递的方式动态更新范围链表的尾结点插入操作
    var prevNode = prevHead;
    // 临界值 
    while (l1 != null && l2 != null) {
        // 每次寻找并仅插入一个尾结点
        if(l1.val <= l2.val){
            // 插入尾结点
            prevNode.next = l1; 
            // 更新指针
            l1 = l1.next
        }else{
            //同上
            prevNode.next = l2;
            l2 = l2.next;
        }
        // js对象引用传递的特性 prevHead 已经更新成加了当前尾结点
        // prevNode 赋值为 返回链表的尾结点对象地址 && 并不修改原地址 循环往复下 只会更新 原链表对象地址的尾结点元素值
        // 当前 prevNode.next 即相当于 原链表的尾部结点地址 类似 原链表.next.next.....next
        prevNode = prevNode.next;
    }
    // 因子问题均有序 剩下不为空结点的链表可以直接追加到 合并好的部分结果链表中
    // 此时的prevNode即为合并好的部分的结果链表的尾结点
    prevNode.next = l1 ? l1 :l2;
    // 返回哨兵结点的next即为所求
    return prevHead.next;
};
```

## 最大子序和
#### 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
示例：
```
输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
```

```JavaScript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let ans = nums[0];
    let sum = 0;
    for(let i=0;i<nums.length;i++){
        if(sum > 0){
            sum += nums[i]
        }else{
            sum = nums[i]
        }
        ans = Math.max(ans,sum)
    }
    return ans
};
```

## 背包问题
#### 背包问题是算法研究中的一个经典问题。试想你是一个保险箱大盗，打开了一个装满奇珍异宝的保险箱，但是你必须将这些宝贝放入你的一个小背包中。保险箱中的物品规格和价值不同。你希望自己的背包装进的宝贝总价值最大。

#### 如果在我们例子中的保险箱中有 5 件物品，它们的尺寸分别是 3、4、7、8、9，而它们的价值分别是 4、5、10、11、13，且背包的容积为 16，那么恰当的解决方案是选取第三件物品和第五件物品，他们的总尺寸是 16，总价值是 23。

#### 初始数据
```JavaScript
let capacity = 16;
let objectArr = [
    {value: 4, size: 3},
    {value: 5, size: 4},
    {value: 10, size: 7},
    {value: 11, size: 8},
    {value: 13, size: 9}
];
```

#### 普通递归

```JavaScript
function knapsack(capacity,objectArr,order){
    if(capacity == 0 || order == 0) return 0;
    if(objectArr[order].size > capacity){
        return knapsack(capacity,objectArr,order - 1)
    }
    return Math.max(objectArr[order].value + knapsack(capacity - objectArr[order].size, objectArr, order - 1),
                    knapsack(capacity, objectArr, order - 1));
}

console.log(knapsack(capacity, objectArr, objectArr.length-1)); // 23
```

#### 动态规划

```JavaScript
function knapsack2(capacity, objectArr) {
    var n = objectArr.length;
    var f = [];
    for (var w = 0; w <= capacity; w++) {
        for (var i = 0; i < n; i++) {
            if (w === 0) {
                f[w] = 0;
            } else if (objectArr[i].size <= w) {
                var size = objectArr[i].size,
                    value = objectArr[i].value
                f[w] = Math.max(f[w - size] + value, f[w] || 0);
            } else {
                f[w] = Math.max(f[w] || 0, f[w - 1]);
            }
        }
    }
    return f[capacity];
}

console.log(knapsack2(capacity, objectArr)); // 23
```

#### 贪心算法 （前提需要尺寸与背包大小匹配，装满背包）

```JavaScript
function knapsack3(capacity, objectArr) {
    // 首先按性价比排序, 高 -> 低
    objectArr.sort(function (a, b) {
        return parseFloat(b.value / b.size) - parseFloat(a.value / a.size);
    });
    // 记录物品个数
    var n = objectArr.length;
    // 记录已经选中尺寸，已选最大的最大价值
    var selected = 0,
        maxValue = 0;
    for (var i = 0; i < n && selected < capacity; i++) {
        var size = objectArr[i].size,
            value = objectArr[i].value;
        if (size <= capacity - selected) {
            maxValue += value;
            selected += size;
        } else {
            // 计算比例
            maxValue += value * ((capacity - selected) / size);
            selected  = capacity;
        }
    }
    return maxValue;
}

console.log(knapsack3(capacity, objectArr)); // 23
```

## 八皇后问题

#### 八皇后问题，是一个古老而著名的问题，是回溯算法的典型案例。该问题是国际西洋棋棋手马克斯·贝瑟尔于1848年提出：在8×8格的国际象棋上摆放八个皇后，使其不能互相攻击，即任意两个皇后都不能处于同一行、同一列或同一斜线上，问有多少种摆法。

```JavaScript
function queen(arr,cur){
    let a = arr.concat();
    if(cur==a.length){
        console.log(a);
        return;
    }
    for(let i=0;i<a.length;i++){
        a[cur] = i;
        let flag = true;

        //与之前路径对比，看是否符合落子，相当于check
        for(let j=0;j<cur;j++){
            let ab = i-a[j];
            if(a[j] == i || (ab > 0 ? ab:-ab) == cur-j ){//是否正对 || 斜对角线
                flag = false;
                break;
            }
        }
        if(flag){
            queen(a,cur+1)
        }
    }
}

queen([1,1,1,1,1,1,1,1],0) 
```

#### 实战：[LeetCode:51. N皇后](https://leetcode-cn.com/problems/n-queens/)

## 全排列

题目描述：给定一个**没有重复**数字的序列，返回其所有可能的全排列。例如

```
示例：   
输入: [1,2,3]
输出: [
 [1,2,3],
 [1,3,2],
 [2,1,3],
 [2,3,1],
 [3,1,2],
 [3,2,1]
]
```

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// 入参是一个数组
const permute = function(nums) {
  // 缓存数组的长度
  const len = nums.length
  // curr 变量用来记录当前的排列内容
  const curr = []
  // res 用来记录所有的排列顺序
  const res = []
  // visited 用来避免重复使用同一个数字
  const visited = {}
  // 定义 dfs 函数，入参是坑位的索引（从 0 计数）
  function dfs(nth) {
      // 若遍历到了不存在的坑位（第 len+1 个），则触碰递归边界返回
      if(nth === len) {
          // 此时前 len 个坑位已经填满，将对应的排列记录下来
          res.push(curr.slice())
          return 
      }
      // 检查手里剩下的数字有哪些
      for(let i=0;i<len;i++) {
          // 若 nums[i] 之前没被其它坑位用过，则可以理解为“这个数字剩下了”
          if(!visited[nums[i]]) {
              // 给 nums[i] 打个“已用过”的标
              visited[nums[i]] = 1
              // 将nums[i]推入当前排列
              curr.push(nums[i])
              // 基于这个排列继续往下一个坑走去
              dfs(nth+1) 
              // nums[i]让出当前坑位
              curr.pop()
              // 下掉“已用过”标识
              visited[nums[i]] = 0
          }
      }
  }
  // 从索引为 0 的坑位（也就是第一个坑位）开始 dfs
  dfs(0)
  return res
};
```

## 第K个大数

题目描述：找出无序数组第K大的元素

```js
//方法一： 利用快排
function findMaxK(arr,k){
    let maxK = arr.length - k;
    function quick(arr,l,q){
        let i=l,j=q,temp;
        if(i<j){
            temp = arr[i]
            while(i <j){
                while(temp<arr[j] && i<j){
                    j--;
                }
                if(i<j){
                    arr[i] = arr[j];
                    i++
                }
                
                while(temp>arr[i] && i<j){
                    i++
                }
                if(i<j){
                    arr[j] = arr[i];
                    j--
                }
            }
            //重要
            arr[i] = temp;
            if(i == maxK){
                console.log(temp);
                return;
            }else{
                if((i-1) > maxK){
                    quick(arr,l,i-1);
                }
                quick(arr,i+1,q)
            }
            
        }
    }
    quick(arr,0,arr.length-1)
    console.log(arr[maxK])
}

//方法二：利用小顶堆
const findKthLargest = function(nums, k) {
   // 初始化一个堆数组
   const heap = []  
   // n表示堆数组里当前最后一个元素的索引
   let n = 0
   // 缓存 nums 的长度
   const len = nums.length  
   // 初始化大小为 k 的堆
   function createHeap() {
       for(let i=0;i<k;i++) {
           // 逐个往堆里插入数组中的数字
           insert(nums[i])
       }
   }
   
   // 尝试用 [k, n-1] 区间的元素更新堆
   function updateHeap() {
       for(let i=k;i<len;i++) {
           // 只有比堆顶元素大的才有资格进堆
           if(nums[i]>heap[0]) {
               // 用较大数字替换堆顶数字
               heap[0] = nums[i]  
               // 重复向下对比+交换的逻辑
               downHeap(0, k)
           }
       }
   }
   
   // 向下对比函数
   function downHeap(low, high) {
       // 入参是堆元素在数组里的索引范围，low表示下界，high表示上界
       let i=low,j=i*2+1 
       // 当 j 不超过上界时，重复向下对比+交换的操作
       while(j<=high) {
           // // 如果右孩子比左孩子更小，则用右孩子和根结点比较
           if(j+1<=high && heap[j+1]<heap[j]) {
               j = j+1
           }
           
           // 若当前结点比孩子结点大，则交换两者的位置，把较小的结点“拱上去”
           if(heap[i] > heap[j]) {
               // 交换位置
               const temp = heap[j]  
               heap[j] = heap[i]  
               heap[i] = temp
               
               // i 更新为被交换的孩子结点的索引
               i=j  
               // j 更新为孩子结点的左孩子的索引
               j=j*2+1
           } else {
               break
           }
       }
   }
   
   // 入参是堆元素在数组里的索引范围，low表示下界，high表示上界
   function upHeap(low, high) {
       // 初始化 i（当前结点索引）为上界
       let i = high  
       // 初始化 j 为 i 的父结点
       let j = Math.floor((i-1)/2)  
       // 当 j 不逾越下界时，重复向上对比+交换的过程
       while(j>=low)  {
           // 若当前结点比父结点小
           if(heap[j]>heap[i]) {
               // 交换当前结点与父结点，保持父结点是较小的一个
               const temp = heap[j] 
               heap[j] = heap[i]  
               heap[i] = temp
               
               // i更新为被交换父结点的位置
               i=j   
               // j更新为父结点的父结点
               j=Math.floor((i-1)/2)  
           } else {
               break
           }
       }
   }

   // 插入操作=将元素添加到堆尾部+向上调整元素的位置
   function insert(x) {
       heap[n] = x  
       upHeap(0, n)
       n++
   }
   
   // 调用createHeap初始化元素个数为k的队
   createHeap()
   // 调用updateHeap更新堆的内容，确保最后堆里保留的是最大的k个元素
   updateHeap()
   // 最后堆顶留下的就是最大的k个元素中最小的那个，也就是第k大的元素
   return heap[0]
};
```

## 最长上升子序列如何优雅地找硬币

```
给定不同面额的硬币 coins 和一个总金额 amount。
编写一个函数来计算可以凑成总金额所需的最少的硬币个数。
如果没有任何一种硬币组合能组成总金额，返回 -1。
```

```
示例1：
输入: coins = [1, 2, 5], amount = 11
输出: 3
解释: 11 = 5 + 5 + 1
```

```
示例2：
输入: coins = [2], amount = 3
输出: -1
```

```js
const coinChange = function(coins, amount) {
    const f = [];
    f[0] = 0;
    for(let i=1;i<=amount;i++){
        //假设f[i] 组合数为无限大
        f[i] = Infinity;
        for(let j=0;j<coins.length;j++){
            //coins[j]: 面币额，i：目标总额 ，f[i-coins[j]] 不加当前数额之前的小组合数
            if(i - coins[j] >= 0){
                f[i] = Math.min(f[i],f[i-coins[j]]+1)
            }
        }
    }
    //如果对应组合数是无限大，则无解
    if(f[amount] === Infinity){
        return -1;
    }
    return f[amount]
}
coinChange([1, 2, 5],11)
```

## 最长上升子序列

```
题目描述：给定一个无序的整数数组，找到其中最长上升子序列的长度。

示例:
输入: [10,9,2,5,3,7,101,18]
输出: 4
解释: 最长的上升子序列是 [2,3,7,101]，它的长度是 4。
```

```js
const lengthOfLIS = function(nums) {
    let len = nums.length;
    if(!len){
        return 0
    }

    let dp = (new Array(len)).fill(1);

    let maxLen = 1;

    for(let i=0;i<len;i++){
        for(let j=0;j<i;j++){
            if(nums[j] < nums[i]){
                dp[i] = Math.max(dp[i],dp[j] + 1)
            }
        }

        if(dp[i] > maxLen){
            maxLen = dp[i]
        }
    }
    return maxLen;
}
```

## 最长回文子串

题目描述：给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

```
示例 1：
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。

示例 2：
输入: "cbbd"
输出: "bb"
```

```js
const longestPalindrome = function(s) {
    const dp = [];
    // 缓存字符串长度
    const len = s.length
    // 初始化状态二维数组
    for (let i = 0; i < len; i ++) {
        dp[i] = [];
    };
    
    // 初始化最长回文子串的两个端点值
    let st = 0, end=0
    // 初始化最长回文子串的初始值为1
    for(let i=0;i<len;i++) {
        dp[i][i] = 1
    }
    // 对相邻的子串做处理
    for(let i=0;i<len-1;i++){
        if(s[i]===s[i+1]) {
            dp[i][i+1] = 1
            st = i 
            end = i+1
        }
    }
    
    // n 代表子串的长度，从3开始递增
    for(let n=3;n<=len;n++) {
        // 下面的两层循环，用来实现状态转移方程
        for(let i=0;i<=len-n;i++) {
            let j = i+n-1
            if(dp[i+1][j-1]) {
                if(s[i]===s[j]){
                    // 若定位到更长的回文子串，则更新目标子串端点的索引值
                    dp[i][j] = 1
                    st = i 
                    end = j
                }
            }
        }
    }
    // 最后依据端点值把子串截取出来即可
    return s.substring(st,end+1);
}
```




