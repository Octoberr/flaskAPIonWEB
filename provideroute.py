# coding:utf-8
from flask import Flask, request, render_template
from sendtoairport import groupingdata
from sendtoairport import getscheduledata

app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    return render_template('test.html')


@app.route('/toairport', methods=['post'])
def toairport():
    args = str(request.form['date'])
    dict = getscheduledata.getquredate(args)
    orderinfo = groupingdata.geteachTimepointSchedule(dict)
    return orderinfo


if __name__ == '__main__':
    app.run('0.0.0.0')