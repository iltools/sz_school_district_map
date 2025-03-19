// 宝安区2024年秋季义务教育公办学校招生计划及招生范围: https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11398657.html
// 宝安区2024年秋季小一初一新生报名公告: https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11322394.html
// 多边形demo：https://lbs.amap.com/demo/javascript-api-v2/example/overlay-editor/polygon-editor-avoidpolygon
// 坐标拾取：https://lbs.amap.com/demo/javascript-api-v2/example/map/click-to-get-lnglat
// 多边形编辑器api: https://lbs.amap.com/api/javascript-api-v2/documentation#polygoneditor

import {baSchoolsData, schoolTypes, educationTypes, schoolBelongTo} from './data.js';
var map = new AMap.Map('container', {
  viewMode: '2D', // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
  zoom:9, // 初始化地图层级
  center: [113.876639,22.576052] // 初始化地图中心点
});
map.on('click', function(e) {
  document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
});

var mapsArray = []
baSchoolsData.forEach(item => {
var polygonArea = new AMap.Polygon({
  path: item.belongs,
  zIndex: 0,
  fillColor: 'rgb(0, 178, 213)',
  fillOpacity: 0.1
})
polygonArea.on('mouseover', () => {
  polygonArea.setOptions({
      fillOpacity: 0.5
  })
})
polygonArea.on('mouseout', () => {
  polygonArea.setOptions({
      fillOpacity: 0.1
  })
})
mapsArray.push(polygonArea)
// 绘制区域
map.add([polygonArea])
// 绘制点
 const icon = new AMap.Icon({
  image: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
  size: [30,38],
  imageSize: new AMap.Size(30,38)
 })
  var marker = new AMap.Marker({
      title: item.schoolName,
      icon,
      position: new AMap.LngLat(item.longitude, item.latitude)
  });
  map.add(marker);
  // 设置标注标签
  marker.setLabel({
      direction:'right',
      offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
      content: `<div>${item.schoolName}</div>`, //设置文本标注内容
  });
  marker.on('click', () => {
      openModal(marker.getPosition(), item);
  })
})
map.setFitView();
// 编辑器功能
var polyEditor = new AMap.PolygonEditor(map);

mapsArray.forEach(item => {
polyEditor.addAdsorbPolygons(item);
// 绑定事件， 双击编辑
item.on('dblclick', () => {
  polyEditor.setTarget(item);
  polyEditor.open();
})
})

polyEditor.on('add', function (data) {
console.log(data);
var polygon = data.target;
polyEditor.addAdsorbPolygons(polygon);
polygon.on('dblclick', () => {
  polyEditor.setTarget(polygon);
  polyEditor.open();
})
})
polyEditor.on('end', function (data) {
  console.log(data);
})
  polyEditor.on('move', function (data) {
  console.log(data);
})
polyEditor.on('adjust', function (data) {
  // data.target._opts.path
  console.log(data);
})
//在指定位置打开信息窗体
function openModal(position, item) {
  var infoWindow = new AMap.InfoWindow({
      content: `
          <div class="openModal">
              <h4 class='input-item'>学校名称: ${item.schoolName}</h4>
              <p class='input-item'>教育阶段: ${educationTypes[item.educationType]}</p>
              <p class='input-item'>所属学区: ${schoolBelongTo[item.schoolBelongTo]}</p>
              <p class='input-item'>学区类型: ${schoolTypes[item.schoolType]}</p>
              <p class='input-item'>咨询电话: ${item.schoolTel}</p>
              <p class='input-item'>招生班数: ${item.schoolClass}</p>
              <p class='input-item'>招生范围: ${item.belongsText}</p></div>
              <p class='input-item'>备注: ${item.memo}</p></div>
          </div>
      `
  });
  // infoWindow.open(map, map.getCenter());
  infoWindow.open(map, position);
}

// 模糊搜索
var autoInfo = new AMap.AutoComplete({
  input: "tipinput",
  city: '440306', // 只在深圳市搜索
});

autoInfo.on('select', (obj) => {
  console.log(obj)
  document.getElementById("lnglat").value = obj?.poi?.location?.lng + ',' + obj?.poi?.location?.lat
})

console.log(autoInfo)


function createPolygon() {
  polyEditor.close();
  polyEditor.setTarget();
  polyEditor.open();
}

export const polygonEditor = {
  add: createPolygon,
  editor: polyEditor
}