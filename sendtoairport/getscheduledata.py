# coding:utf-8
import pymssql
import json


def getquredate(args):
    conn = pymssql.connect("120.27.225.54", "devops", "!qaz@wsx#edc123", "TransferDB_V2_Driver", charset="utf8")
    cur =conn.cursor()
    sql = "SELECT BID,PickupLatitude lat,PickupLongitude lng,SeatNum seatnum,TimeTable timetable,CAST(PickupTime AS DATE) AS [date] " \
          "FROM dbo.Booking WHERE BookingType = 'ClearPort' and TimeTable='TimeTable8' and CAST(PickupTime AS DATE)='{}'".format(args)
    cur.execute(sql)
    data = cur.fetchall()
    cur.close()
    conn.close()
    jsonData = []
    for row in data:
        result = {}
        result['BID'] = str(row[0])
        result['bdlat'] = float(row[1])
        result['bdlng'] = float(row[2])
        result['seatnum'] = 1
        result['timetable'] = "TimeTable12"
        result['date'] = "2017-07-16"
        result['driver'] = None
        jsonData.append(result)
    # jsondatar = json.dumps(jsonData, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    # f = open('unceshijsondata9.json', 'w+')
    # # 写数据
    # f.write(jsondatar)
    # # 关闭文件
    # f.close()

    return jsonData

