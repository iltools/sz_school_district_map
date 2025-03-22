// 宝安区2024年秋季义务教育公办学校招生计划及招生范围: https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11398657.html
// 宝安区2024年秋季小一初一新生报名公告: https://www.baoan.gov.cn/jyj/zwgk/zdly/zsxx/content/post_11322394.html
// 多边形demo：https://lbs.amap.com/demo/javascript-api-v2/example/overlay-editor/polygon-editor-avoidpolygon
// 坐标拾取：https://lbs.amap.com/demo/javascript-api-v2/example/map/click-to-get-lnglat
// 多边形编辑器api: https://lbs.amap.com/api/javascript-api-v2/documentation#polygoneditor

import {
  baSchoolsData,
  schoolTypes,
  educationTypes,
  schoolBelongTo,
} from "./data.js";
const { polygonSchoolPath, originSchoolData, formatOriginSchoolData } =
  baSchoolsData;
var map = new AMap.Map("container", {
  viewMode: "3D", // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 viewMode: '3D'
  zoom: 9, // 初始化地图层级
  center: [113.876639, 22.576052], // 初始化地图中心点
});
var polyEditor;
var controlBar;
map.on("click", function (e) {
  document.getElementById("lnglat").value =
    e.lnglat.getLng() + "," + e.lnglat.getLat();
});

var mapsArray = [];

function drawPolygon() {
  polygonSchoolPath.forEach((item) => {
    var polygonArea = new AMap.Polygon({
      path: item.belongs,
      zIndex: 0,
      fillColor: "rgb(0, 178, 213)",
      fillOpacity: 0.1,
      extData: item,
    });
    polygonArea.on("mouseover", () => {
      polygonArea.setOptions({
        fillOpacity: 0.8,
        fillColor: "rgb(248, 218, 218)",
      });
    });
    polygonArea.on("mouseout", () => {
      polygonArea.setOptions({
        fillOpacity: 0.1,
        fillColor: "rgb(0, 178, 213)",
        zIndex: 0,
      });
    });
    polygonArea.on("rightclick", (data) => {
      console.log(data);
      var groupName = data?.target?._opts?.extData?.groupName;
      var schools = formatOriginSchoolData.filter(
        (item) => item.groupName === groupName
      );
      var school1 = schools.filter((item) => item.educationType === 1);
      var school2 = schools.filter((item) => item.educationType === 2);
      openAreaModal(new AMap.LngLat(data.lnglat.lng, data.lnglat.lat), {
        school1: school1,
        school2: school2,
      });
    });
    mapsArray.push(polygonArea);
    // 绘制区域
    map.add([polygonArea]);
  });
}

function drawPoint() {
  formatOriginSchoolData.forEach((item) => {
    // 绘制点
    const icon = new AMap.Icon({
      image:
        "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
      size: [30, 38],
      imageSize: new AMap.Size(30, 38),
    });
    var marker = new AMap.Marker({
      title: item.schoolName,
      icon,
      position: new AMap.LngLat(item.longitude, item.latitude),
    });
    map.add(marker);
    // 设置标注标签
    marker.setLabel({
      direction: "right",
      offset: new AMap.Pixel(10, 0), //设置文本标注偏移量
      content: `<div>${item.schoolName}</div>`, //设置文本标注内容
    });
    marker.on("click", () => {
      openModal(marker.getPosition(), item);
    });
  });
}

function initPolygonEditor() {
  // 编辑器功能
  polyEditor = new AMap.PolygonEditor(map);
  mapsArray.forEach((item) => {
    polyEditor.addAdsorbPolygons(item);
    // 绑定事件， 双击编辑
    item.on("dblclick", () => {
      polyEditor.setTarget(item);
      polyEditor.open();
    });
  });

  polyEditor.on("add", function (data) {
    console.log(data);
    var polygon = data.target;
    polyEditor.addAdsorbPolygons(polygon);
    polygon.on("dblclick", () => {
      polyEditor.setTarget(polygon);
      polyEditor.open();
    });
  });
  polyEditor.on("end", function (data) {
    console.log(data);
  });
  polyEditor.on("move", function (data) {
    console.log(data);
  });
  polyEditor.on("adjust", function (data) {
    // data.target._opts.path
    console.log(data);
    console.log(`学区路径为：${JSON.stringify(data?.target?._opts?.path)}`);
  });
}

function initControlBar() {
  // 指南针
  controlBar = new AMap.ControlBar({
    position: {
      top: "10px",
      right: "10px",
    },
  });
  map.addControl(controlBar);
}

//在指定位置打开信息窗体
function openModal(position, item) {
  var infoWindow = new AMap.InfoWindow({
    content: `
          <div class="openModal">
              <h1 class="font-bold text-sky-900">学校名称: ${
                item.schoolName
              }</h1>
              <p class='input-item'>教育阶段: ${
                educationTypes[item.educationType]
              }</p>
              <p class='input-item'>所属学区: ${
                schoolBelongTo[item.schoolBelongTo]
              }</p>
              <p class='input-item'>学区类型: ${
                schoolTypes[item.schoolType]
              }</p>
              <p class='input-item'>咨询电话: ${item.schoolTel}</p>
              <p class='input-item'>招生班数: ${item.schoolClass}</p>
              <p class='input-item'>招生范围: ${item.belongsText}</p>
              <p class='input-item'>备注: ${item.memo}</p>
          </div>
      `,
  });
  // infoWindow.open(map, map.getCenter());
  infoWindow.open(map, position);
}

function openAreaModal(position, item) {
  var school1 = item.school1.map((item) => item.schoolName);
  var school2 = item.school2.map((item) => item.schoolName);
  var infoWindow = new AMap.InfoWindow({
    content: `
          <div class="openModal">
              <h1 class="font-bold text-sky-900">该区域包含的学校</h1>
              <div class="flex"><div class="shrink-0">小学：</div><div>${school1}</div></div>
              <div class="flex"><div class="shrink-0">初中：</div><div>${school2}</div></div>
          </div>
      `,
  });
  // infoWindow.open(map, map.getCenter());
  infoWindow.open(map, position);
}

function initAutoComplete() {
  // 模糊搜索
  var autoInfo = new AMap.AutoComplete({
    input: "tipinput",
    city: "440306", // 只在深圳市搜索
  });
  autoInfo.on("select", (obj) => {
    console.log(obj);
    document.getElementById("lnglat").value =
      obj?.poi?.location?.lng + "," + obj?.poi?.location?.lat;
  });
}

drawPolygon();
drawPoint();
initPolygonEditor();
initAutoComplete();
initControlBar();

map.setFitView();

export const polygonEditor = {
  add: () => {
    polyEditor.close();
    polyEditor.setTarget();
    polyEditor.open();
  },
  editor: polyEditor,
};
