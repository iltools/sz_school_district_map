
# 郑重提示

> 此学区地图仅供参考，注意甄别，不能以此作为标准，有疑问请咨询对应教育局。

# 使用说明

## [线上Demo](https://iltools.github.io/sz_school_district_map/baoan/index.html)

## 本地部署

下载后，请启用服务运行本项目，如使用http-server

# 数据来源

## [宝安区2024年秋季义务教育公办学校招生计划及招生范围](https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11398657.html)

## 个人理解+其他互联网整合

## [深圳统一编码地址](http://www.szzlb.gov.cn/govmap/#/indexmap)

# 数据误差

> 不能保证100%正确，特别是XX社区确定的学区范围注意甄别，如有错误，请联系作者。
>

# 数据转换为json

涉及数据比较多，善用AI帮忙处理，[宝安区2024年秋季小一初一新生报名公告](https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11322394.html)中的[附件1：宝安区2024年秋季义务教育公办学校招生计划及招生范围 .doc](https://www.baoan.gov.cn/attachment/1/1451/1451171/11322394.doc)

上传文档，未防止数据过多处理不过来，按区执行。以下是豆包提示器。

1.先提取第几学区的json数据
2.把学校改为学校名称，备注改为学区类型
3.学校名称改为schoolName，备注改为memo，招生范围改为belongsText，招生班数改为schoolClass，学区类型改为schoolType，咨询电话改为schoolTel,"单享学区"改为2,"共享学区"改为1;删除序号，接收申请对象键值；增加键值，分别为educationType: 2，schoolBelongTo: 1, longitude: 0, latitude:0, belongs: []
4.把这段代码中的schoolType: ""，后面的值填充为前一个schoolType的值，直到下一个schoolType的值不为""；belongsText也这样处理
5.首先schoolType后面的值不是整数，那么就把值放到memo后面的值中; 然后判断这个值如果包含分享学区，则schoolType值改为0, 如果包含共享学区，则schoolType值改为1, 如果包含单享学区，则schoolType值改为2, 如果包含优享学区，则schoolType值改为3, 如果包含大学区，则schoolType值改为4;注意包含的字必须是完整的;不要注释

# 最后说明

> 本项目使用高德地图，目前使用的是个人key，多人使用可能导致[配额](https://lbs.amap.com/upgrade#price)使用完，如可以请使用自己的key，此项目起初是为了方便我查询幼升小/小升初学区，后来觉得家长也可能需要，其他人请高抬贵手，手下留情，别把我的高德号给弄限制了。

