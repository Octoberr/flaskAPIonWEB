function bwMap(type) {
    this.type = type;
    this.searchNum = 10;
    var _this = this;
    var _map = {};
    //百度类 http://developer.baidu.com/map/reference/index.php?title=Class:%E6%80%BB%E7%B1%BB/%E8%A6%86%E7%9B%96%E7%89%A9%E7%B1%BB
    var baidu = function() {
        var _thisClass = this;
        this.ini = function(option) {
            var map = new BMap.Map(option.id);
            var point = new BMap.Point(option.lon, option.lat); // 地图的中心地理坐标。
            map.centerAndZoom(point, option.level);
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.enableScrollWheelZoom();
            _this.map = map;
        };
        this.setCenter = function(option) {
            var point = new BMap.Point(option.lon, option.lat);
            _this.map.panTo(point);
        };
        this.setMark = function(option) {
            var point = new BMap.Point(option.lon, option.lat);
            var ops={ title: option.title}
            if(option.offset){
                ops.offset=new BMap.Size(option.offset[0],option.offset[1]);
            }
            var marker = new BMap.Marker(point, ops);
            _this.map.addOverlay(marker);
            /*marker.addEventListener("click", function() {
             var opts = {
             title: option.htmlTitle // 信息窗口标题
             };
             var infoWindow = new BMap.InfoWindow(option.html, opts); // 创建信息窗口对象
             _this.map.openInfoWindow(infoWindow, point);
             });*/
            return marker;
        };
        this.clearAllMarks = function() {
            _this.map.clearOverlays();
        };
        this.clearMark = function(marker) {
            _this.map.removeOverlay(marker);
        };
        this.getDistance = function(start, end) {
            var pointStart = new BMap.Point(start.lon, start.lat);
            var pointEnd = new BMap.Point(end.lon, end.lat);
            return _this.map.getDistance(pointStart, pointEnd);
        };
        this.getLocation = function(option, callback) {
            var gc = new BMap.Geocoder();
            gc.getLocation(new BMap.Point(option.lon, option.lat), function(res) {
                callback(res);
            });
        };
        this.search = function(keyword, callback) {
            _thisClass.clearAllMarks();
            var options = {
                renderOptions: { map: _this.map, autoViewport: true },
                pageCapacity: _this.searchNum,
                onSearchComplete: function(res) {
                    if (callback) callback(res);
                }
            };
            var local = new BMap.LocalSearch(_this.map, options);
            local.search(keyword);

        };
    };
    //腾讯类
    var tencent = function() {
        var _thisClass = this;
        _thisClass.markers = [];
        this.ini = function(option) {
            var point = new qq.maps.LatLng(option.lat, option.lon); // 地图的中心地理坐标。
            var tencentOption = {
                center: point,
                zoom: option.level
            };
            var map = new qq.maps.Map(document.getElementById(option.id), tencentOption);
            _this.map = map;
        };
        this.setCenter = function(option) {
            var center = new qq.maps.LatLng(option.lat, option.lon);
            _this.map.setCenter(center);
        };
        this.setMark = function(option) {
            var center = new qq.maps.LatLng(option.lat, option.lon);
            var marker = new qq.maps.Marker({
                position: center,
                map: _this.map
            });
            var info = new qq.maps.InfoWindow({
                map: _this.map
            });
            marker.setTitle(option.title);
            _thisClass.markers.push(marker);
            var title = "<div>" + option.htmlTitle + "</div>";
            qq.maps.event.addListener(marker, 'click', function() {
                info.open();
                info.setContent(title + option.html);
                info.setPosition(marker.getPosition());
            });
        };
        this.clearAllMarks = function() {
            while (overlay = _thisClass.markers.pop()) {
                overlay.setMap(null);
            }
        };
        this.clearMark = function(marker) {
            marker.setMap(null);
        };
        this.getDistance = function(start, end) {
            return qq.maps.geometry.spherical.computeDistanceBetween(new qq.maps.LatLng(start.lat, start.lon), new qq.maps.LatLng(end.lat, end.lon));
        };
        this.getLocation = function(option, callback) {
            var geocoder = new qq.maps.Geocoder();
            var latLng = new qq.maps.LatLng(option.lat, option.lon);
            geocoder.getAddress(latLng);
            geocoder.setComplete(function(res) {
                callback(res.detail);
            });
        };
        this.search = function(keyword, callback) {
            var SearchOptions = {
                complete: function(results) {
                    var pois = results.detail.pois;
                    var latlngBounds = new qq.maps.LatLngBounds();
                    for (var i = 0, l = pois.length; i < l; i++) {
                        latlngBounds.extend(pois[i].latLng);
                        _thisClass.setMark({
                            lon: pois[i].latLng.lng,
                            lat: pois[i].latLng.lat,
                            title: pois[i].name,
                            htmlTitle: pois[i].name,
                            html: pois[i].address
                        });
                        _this.map.fitBounds(latlngBounds);
                    }
                    if (callback) callback(results);
                },
                pageIndex: 1,
                pageCapacity: 10,
                location: "北京",
            };
            var searchService = new qq.maps.SearchService(SearchOptions);
            _thisClass.clearAllMarks();
            searchService.search(keyword);
        };
    };
    //高德类
    var gaode = function() {
        var _thisClass = this;
        this.ini = function(option) {
            var map = new AMap.Map(option.id, {
                resizeEnable: true,
                zoom: option.level,
                center: [option.lon, option.lat] // 地图的中心地理坐标。
            });
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'],
                function() {
                    map.addControl(new AMap.ToolBar());
                    map.addControl(new AMap.Scale());
                });
            _this.map = map;
        };
        this.setCenter = function(option) {
            var lnglat = new AMap.LngLat(option.lon, option.lat);
            _this.map.panTo(lnglat);
        };
        this.setMark = function(option) {
            var markOption = {
                position: [option.lon, option.lat],
                title: option.title
            };
            markOption.map = _this.map;
            var marker = new AMap.Marker(markOption);
            var title = "<div>" + option.htmlTitle + "</div>";
            marker.on('click', function() {
                var infoWindow = new AMap.InfoWindow({
                    content: title + option.html,
                    offset: new AMap.Pixel(0, -25)
                });
                infoWindow.open(_this.map, [option.lon, option.lat]);
            });
        };
        this.clearAllMarks = function() {
            _this.map.clearMap();
        };
        this.clearMark = function(marker) {
            marker.remove();
        };
        this.getDistance = function(start, end) {
            var lnglat = new AMap.LngLat(start.lon, start.lat);
            return lnglat.distance([end.lon, end.lat]);
        };
        this.getLocation = function(option, callback) {
            var lnglat = [option.lon, option.lat];
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(lnglat, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    var info = {};
                    info.address = result.regeocode.formattedAddress;
                    info.addressComponents = result.regeocode.addressComponent;
                    callback(info);
                } else {
                    callback(status);
                }
            });
        };
        this.search = function(keyword, callback) {
            _thisClass.clearAllMarks();
            AMap.service('AMap.PlaceSearch', function() { //回调函数
                var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                    pageSize: 5,
                    pageIndex: 1,
                    city: "010", //城市
                    map: _this.map
                });
                //关键字查询
                placeSearch.search(keyword, function(status, result) {
                    if (callback) callback(result);
                });
            });
        };
    };
    /**
     * 初始化，分配地图类
     * @author duantingting@bestwise.cc 2016-12-01
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    this.ini = function(option) {
        if (type === 'baidu') {
            _map = new baidu();
        } else if (type === 'tencent') {
            _map = new tencent();
        } else if (type === 'gaode') {
            _map = new gaode();
        }
        _map.ini(option);
    };
    /**
     * 重置地图中心
     */
    this.setCenter = function(option) {
        _map.setCenter(option);
    };
    /**
     * 在地图上设计标记
     * @author duantingting@bestwise.cc 2016-12-01
     * @param  {[type]} option [description]
     */
    this.setMark = function(option) {
        markOption = {
            title: "",
            htmlTitle: "",
            html: ""
        };
        for(var i in option){
            markOption[i]=option[i];
        }
        return _map.setMark(markOption);
    };
    /**
     * 清除所有marker
     * @author duantingting@bestwise.cc 2016-12-16
     * @return {[type]} [description]
     */
    this.clearAllMarks = function() {
        _map.clearAllMarks();
    };
    /**
     * 计算两点距离start开始坐标，end结尾坐标 单位M
     * @author duantingting@bestwise.cc 2016-12-05
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
     */
    this.getDistance = function(start, end) {
        return _map.getDistance(start, end);
    };
    /**
     * 根据坐标获取地理信息
     * @author duantingting@bestwise.cc 2016-12-05
     * @param  {[type]}   option   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.getLocation = function(option, callback) {
        _map.getLocation(option, callback);
    };
    /**
     * 搜索功能
     * @author duantingting@bestwise.cc 2016-12-13
     * @param  {[type]}   keyword  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.search = function(keyword, callback) {
        _map.search(keyword, callback);
    };

}
