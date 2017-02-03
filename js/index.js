if('indexedDB' in window){
	//检测是否支持indexed database
}else{
	mui.alert('您的手机占不支持');
}
//数据库信息
var DB = {
	name:'admin_users',
	version:1
}
var db;
function openDB(name,version){
	//第一个参数是数据库名称，如果存在则打开，如果不存在就创建
	//第二个参数是数据库版本，用于更新数据库结构
	var request = window.indexedDB.open(name,version);
	
		request.onerror = function(e){
			mui.alert('打开数据库失败');
		}
		
		request.onsuccess = function(e){
			db = request.result;
			ReadAll();
		}
		//操作数据库（创建删除修改）
		//首次打开数据库或改变数据库版本的时候触发
		request.onupgradeneeded = function(e){
			//使用createObjectStore()方法创建一个对象存储
			//此方法接受两个参数：存储的名称和参数对象
			//keypath是用户数据的唯一标识 或者使用索引
			var objectStore = e.target.result.createObjectStore("users",{keyPath:'name'});
		}
}

function Add(name,account,password){
	//transaction()方法是用来指定我们想要进行事务处理的对象存储，接受3个参数
	//第一个（必选）要处理的对象存储的列表数组
	//第二个（可选）指定操作方式 只读/读写
	//第三个（可选）版本变化
	//add()方法用于添加数据
	var request = db.transaction(["users"],"readwrite").objectStore("users").add({
		name:name,
		account:account,
		password:password
	});
	
	request.onsuccess = function(e){
		mui.toast('成功');
		var list = document.querySelector('#list');
		var dom = '<li class="mui-table-view-cell mui-collapse">';
					dom+= '<a class="mui-navigate-right" href="#">'+name+'</a>';
					dom+= '<div class="mui-collapse-content"><p><span>账号：</span>'+account+'</p>';
					dom+= '<p><span>密码：</span>'+password+'</p></div></li>';
			list.innerHTML += dom;
	}
	
	request.onerror = function(e){
		mui.toast('失败');
	}
}

function Read(name){
	var objectStore = db.transaction(["users"]).objectStore("users");
	//get()方法用于获取数据
	var request = objectStore.get(name);
		
		request.onerror = function(event){
			mui.toast('读取失败');
		}
		
		request.onsuccess = function(event){
			if(request.result){
				console.log(request.result);
			}
		}
}

function ReadAll(){
	var objectStore = db.transaction("users").objectStore("users");
	//openCursor()方法用于获取所有数据
	var request = objectStore.openCursor();
	
		request.onsuccess = function(event){
			//db.close();
			var res = event.target.result;
			var list = document.querySelector('#list');
			if(res){
				var dom = '<li class="mui-table-view-cell mui-collapse">';
					dom+= '<a class="mui-navigate-right" href="#">'+res.value.name+'</a>';
					dom+= '<div class="mui-collapse-content"><p><span>账号：</span>'+res.value.account+'</p>';
					dom+= '<p><span>密码：</span>'+res.value.password+'</p></div></li>';
					
				list.innerHTML += dom;
				//console.log(res.value);
				res.continue();
			}
		}
		
		request.onerror = function(e){
			mui.toast('读取失败')
		}
}

function Remove(name){
	//delete()方法用于删除数据
	var request = db.transaction("users","readwrite").objectStore('users').delete(name);
		request.onsuccess = function(event){
			mui.toast('删除成功');
		}
		request.onerror = function(){
			mui.toast('删除失败')
		}
}
openDB(DB.name,DB.version);


var submits = document.querySelector('#submit');
function display(dis){
	var bg = document.querySelectorAll('.alert-bg')[0];
	var alert = document.querySelectorAll('.alert')[0];
	alert.style.display = dis;
	bg.style.display = dis;
}
submits.onclick = function(){
	var name 	 = document.querySelector('#name').value;
	var account  = document.querySelector('#account').value;
	var password = document.querySelector('#password').value;
	if(!name || !account || !password){
		return mui.toast('请输入完整信息');
	}
	display('none');
	Add(name,account,password)
}

