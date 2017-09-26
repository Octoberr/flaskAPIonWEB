# coding:utf-8
"""
Create by Wangmeng Song
July 21,2017
"""

import shapefile as sf
from shapely.geometry import Polygon, Point
import os
import inspect
import numpy as np
import json

filedir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))) + "/" + "area"
pingchearea = u'pincheArea.dbf'  # 拼车的区域，已更新
westoutside = u'area26.dbf'   # 已变成area26
eastpick = u'area28.dbf'   # area28
westpick = u'area27.dbf'    # area27
zhuanchejieji = u'zhuanchejieji.dbf'
zhuanchesongji = u'zhuanchesongji.dbf'
# 在东边的区域
ateastarray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 27]


class SIDE:
    # 不再用此排班范围
    # def chengduArea(self, advanceGetOnTheCar, rmtspID, rmtspLoc, rmtspSeat):
    #     latfilename = filedir + "/" + schedulearea
    #     polys = sf.Reader(latfilename)
    #     polygon = polys.shapes()
    #     shpfilePoints = []
    #     for shape in polygon:
    #         shpfilePoints = shape.points
    #     polygon = Polygon(shpfilePoints)
    #     delindex = []
    #     for i in range(len(rmtspLoc)):
    #         lng = rmtspLoc[i][1]
    #         lat = rmtspLoc[i][0]
    #         point = Point(lng, lat)
    #         if polygon.contains(point):
    #             continue
    #         else:
    #             advanceGetOnTheCar.append(rmtspID[i])   # 去除显示区域外的订单
    #             delindex.append(i)
    #     # 删除提前上车的订单
    #     for deli in reversed(delindex):
    #         del (rmtspID[deli])
    #         del (rmtspLoc[deli])
    #         del (rmtspSeat[deli])
    # 地区东边和西边的代码，地图东为1，西为2,array
    def ateast(self, orderNum, arealoclist):
        sideNo = np.zeros([orderNum], dtype=int)
        for i in range(len(arealoclist)):
            if arealoclist[i] in ateastarray:
                sideNo[i] = 1
            else:
                sideNo[i] = 2
        return sideNo

    def atwest2out(self, westLoc, orderNo):
        westsideNo = np.zeros([orderNo], dtype=int)
        westoutfilename = filedir + "/" + westoutside
        polys = sf.Reader(westoutfilename)
        polygon = polys.shapes()
        shpfilePoints = []
        for shape in polygon:
            shpfilePoints = shape.points
        polygon = Polygon(shpfilePoints)
        for i in range(len(westLoc)):
            lng = westLoc[i][1]
            lat = westLoc[i][0]
            point = Point(lng, lat)
            if polygon.contains(point):
                westsideNo[i] = 1         # 1表示在2环到2.5环之间
            else:
                westsideNo[i] = 2           # 2表示在西边2环内
        return westsideNo

    # 判断是否在西边2环和2.5环
    # def ateast2out(self, eastLoc, orderNo):
    #     eastsideNo = np.zeros([orderNo], dtype=int)
    #     eastoutfilename = filedir + "/" + eastoutside
    #     polys = sf.Reader(eastoutfilename)
    #     polygon = polys.shapes()
    #     shpfilePoints = []
    #     for shape in polygon:
    #         shpfilePoints = shape.points
    #     polygon = Polygon(shpfilePoints)
    #     for i in range(len(eastLoc)):
    #         lng = eastLoc[i][1]
    #         lat = eastLoc[i][0]
    #         point = Point(lng, lat)
    #         if polygon.contains(point):
    #             eastsideNo[i] = 1         # 1表示在2环到2.5环之间
    #         else:
    #             eastsideNo[i] = 2           # 2表示在东边2环内
    #     return eastsideNo

    def orderinchengdutwofive(self, orderdata):
        latfilename = filedir + "/" + pingchearea
        polys = sf.Reader(latfilename)
        polygon = polys.shapes()
        shpfilePoints = []
        for shape in polygon:
            shpfilePoints = shape.points
        polygon = Polygon(shpfilePoints)
        lng = orderdata['bdlng']
        lat = orderdata['bdlat']
        point = Point(lng, lat)
        if polygon.contains(point):
            orderdata['inside'] = True
        else:
            orderdata['inside'] = False
        jsondatar = json.dumps(orderdata, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        return jsondatar

    def specificitywholeChengDu(self, SpecificityOrderdata):
        tripnum = SpecificityOrderdata['triptype']  # 1为接机，2为送机
        if tripnum == 1:
            latfilename = filedir + "/" + zhuanchejieji
        else:
            latfilename = filedir + "/" + zhuanchesongji
        polys = sf.Reader(latfilename)
        polygon = polys.shapes()
        shpfilePoints = []
        for shape in polygon:
            shpfilePoints = shape.points
        polygon = Polygon(shpfilePoints)
        lng = SpecificityOrderdata['bdlng']
        lat = SpecificityOrderdata['bdlat']
        point = Point(lng, lat)
        if polygon.contains(point):
            SpecificityOrderdata['inside'] = True
        else:
            SpecificityOrderdata['inside'] = False
        jsondatar = json.dumps(SpecificityOrderdata, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        return jsondatar
    # def specificitywholeChengDu(self, SpecificityOrderdata):
    #     latfilename = filedir + "/" + zhuanchejieji
    #     polys = sf.Reader(latfilename)
    #     polygon = polys.shapes()
    #     shpfilePoints = []
    #     for shape in polygon:
    #         shpfilePoints = shape.points
    #     polygon = Polygon(shpfilePoints)
    #     lng = SpecificityOrderdata['bdlng']
    #     lat = SpecificityOrderdata['bdlat']
    #     point = Point(lng, lat)
    #     if polygon.contains(point):
    #         SpecificityOrderdata['inside'] = True
    #     else:
    #         SpecificityOrderdata['inside'] = False
    #     jsondatar = json.dumps(SpecificityOrderdata, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    #     return jsondatar

    def eastpick(self, pickpoint):
        eastfile = filedir + "/" + eastpick
        polys = sf.Reader(eastfile)
        polygon = polys.shapes()
        shpfilePoints = []
        for shape in polygon:
            shpfilePoints = shape.points
        polygon = Polygon(shpfilePoints)
        lng = pickpoint[1]
        lat = pickpoint[0]
        point = Point(lng, lat)
        if polygon.contains(point):
            return True
        else:
            return False

    def westpick(self, pickpoint):
        westfile = filedir + "/" + westpick
        polys = sf.Reader(westfile)
        polygon = polys.shapes()
        shpfilePoints = []
        for shape in polygon:
            shpfilePoints = shape.points
        polygon = Polygon(shpfilePoints)
        lng = pickpoint[1]
        lat = pickpoint[0]
        point = Point(lng, lat)
        if polygon.contains(point):
            return True
        else:
            return False











