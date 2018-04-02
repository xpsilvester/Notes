//一些mysql语句的写法

//1.concat的写法，用逗号连接语句和变量
use xxxxx;
set @pageIndex = 3;
set @pageSize = 10;
set @sql = concat('
	SELECT 
		id, classId, picURL, publishDate, title 
	FROM 
		news 
	WHERE (isIssue = 1 and year(publishDate)=2016) ORDER BY publishDate DESC limit ',(@pageIndex-1)*@pageSize ,',' ,@pageSize
);
prepare stmt from @sql;
execute stmt;

//2.用变量来表示table
use xxxxx;
select 
    pi.id,pi.productStateId,pi.productModel,pi.productName,pi.displayOrder,pi.spotlight,pi.saleDisplayOrder
from 
    ProductInfo pi inner join ProductList pl on pi.id=pl.productId 
                   inner join ProductClass pc on pl.classId=pc.id
where 
    pc.classTip="tmp" and pi.productStateId<>0

//3.关键语句：(select * from Security_Story where visible=1) as a
use xxxxx;
set @pageIndex = 1;
set @readCount = 10;

set @sql = concat(
	'select 
		a.updateDate,a.detail,a.id,a.title,b.className
	from
		(select * from Security_Story where visible=1) as a
	inner join 
		Security_StoryClass b on a.classId = b.id
	order by a.id desc 
	limit '
		,(@pageIndex-1)*@readCount ,',' ,@readCount
);

prepare stmt from @sql;
execute stmt;

//4.升级版

use xxxxx;
set @pageIndex = 1;
set @pageSize = 10;
set @classtip = 'wireless';

set @sql = concat(
	'select 
		c.* 
	from 
		(select b.* from 
			(SELECT a.id, a.title, a.publishDate, a.hits, a.displayOrder 
				FROM Article a 
				INNER JOIN 
					articleclass ac ON a.classId = ac.id 
					WHERE a.visible = 1 AND a._typeId != 2 and ac.classTip = \'', @classtip, '\' ORDER BY a.publishDate DESC limit ', @pageIndex * @pageSize, ' ) 
				b order by b.publishDate asc limit ', @pageSize, ' 
			) 
		c ORDER BY c.publishDate DESC'
);
prepare stmt from @sql;
execute stmt;