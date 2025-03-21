// 数据根据ai生成
// ！！步骤！！
// 上传文档，未防止数据过多处理不过来，分区执行
// 1.先提取第几学区的json数据
// 2.把学校改为学校名称，备注改为学区类型
// 3.学校名称改为schoolName，备注改为memo，招生范围改为belongsText，招生班数改为schoolClass，学区类型改为schoolType，咨询电话改为schoolTel,"单享学区"改为2,"共享学区"改为1;删除序号，接收申请对象键值；增加键值，分别为educationType: 2，schoolBelongTo: 1, longitude: 0, latitude:0, belongs: []
// 4.把这段代码中的schoolType: ""，后面的值填充为前一个schoolType的值，直到下一个schoolType的值不为“”；belongsText也这样处理
// 5.首先schoolType后面的值不是整数，那么就把值放到memo后面的值中; 然后判断这个值如果包含分享学区，则schoolType值改为0, 如果包含共享学区，则schoolType值改为1, 如果包含单享学区，则schoolType值改为2, 如果包含优享学区，则schoolType值改为3, 如果包含大学区，则schoolType值改为4;注意包含的字必须是完整的;不要注释
import area1 from "./area/year24/area2.js";
import area2 from "./area/year24/area2.js";
import area3 from "./area/year24/area2.js";
import area4 from "./area/year24/area2.js";
import area5 from "./area/year24/area2.js";
import area6 from "./area/year24/area2.js";

var originSchoolData = [
   // ...area1,
   ...area2,
   // ...area3,
   // ...area4,
   // ...area5,
   // ...area6,
]
var formatOriginSchoolData = originSchoolData.map(item => {
  return {
    ...item,
    ...{
      groupName: `${item.schoolBelongTo}_${item.educationType}_${item.belongsText}`,
    }
  }
})
var schoolsDataGroup = _.groupBy(formatOriginSchoolData, 'belongsText')
var polygonSchoolPath = []
for (const [key, value] of Object.entries(schoolsDataGroup)) {
  polygonSchoolPath.push({
    belongs: _.get(value, '0.belongs', []),
    belongsText: _.get(value, '0.belongsText', ""),
    groupName: _.get(value, '0.groupName', ""),
  })
}
const allData = {
  originSchoolData,
  // 按组学区path
  polygonSchoolPath,
  formatOriginSchoolData
}

console.log(allData)

export default allData