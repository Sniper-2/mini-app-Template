/*
 * @Author: Alan
 * @Date: 2019-12-24 15:49:06
 * @LastEditors  : Alan
 * @LastEditTime : 2020-01-09 16:33:47
 * @Description: 格式化日期
 */

let DateMethods = {

	/**
	 * 获取N个单位前或者后的日期
	 * @param {Number | String} n 获取N个单位前后的日期，0获取今天的日期
	 * @param {String} unit 			单位，可选值 day | month | year
	 * @param {String} position 	基于当天的前后，默认是前，可选值 front | after 
	 * @returns { Array } 				格式化后的时间 []
	 */
	 get_n_day_date (n = 1, unit = 'day', position = 'front') {
		// 获取n单位前的日期，需要将n转为负数
		if (position == 'front') n = n - n * 2
		let date = new Date()

		if (unit == 'day') date.setDate(date.getDate() + n)
		else if (unit == 'month') date.setMonth(date.getMonth() + n)
		else if (unit == 'year') date.setFullYear(date.getFullYear() + n)

		let startTimes = this.format_date(date, 'YY/MM/DD') + ' 00:00:00'
		let endTimes = this.format_date(new Date(), 'YY/MM/DD') + ' 23:59:59'

		// 获取昨天或者明天开始到结束的时间段
		if (Math.abs(n) == 1) {
			endTimes = this.format_date(date, 'YY/MM/DD') + ' 23:59:59'
		}
		return [
			startTimes,
			endTimes
		]
	 },


	/**
	 * 按照给定的日期返回指定的格式进行格式化后的时间
	 * @param {*} date 需要进行格式化的时间
	 * @param {*} format 需要进行格式化的时间格式
	 * @returns { String } 格式化后的时间
	 */
	format_date (date, format = 'YY-MM-DD h:m:s') {
		if (!date) return;

		if (typeof date == 'string') date = date.replace(/-/g, '/')
		
		let value = this.date_object(date);
		let dateStr = format.replace(/YY/g, value.year);
		dateStr = dateStr.replace(/MM/g, value.month);
		dateStr = dateStr.replace(/DD/g, value.day);
		dateStr = dateStr.replace(/h/g, value.hour);
		dateStr = dateStr.replace(/m/g, value.minute);
		dateStr = dateStr.replace(/s/g, value.second);
		return dateStr;
	},

	/**
	 * 将秒数转换为日期格式 90050 -> 01天 01小时00分钟50秒
	 * 主要用于倒计时使用，设置计时器，循环调用
	 * @param { Number } second 进行转换的秒数(不是毫秒)
	 * @param { String } format 转换格式
	 */
 	second_mturn_date (second, format = 'DD天 h小时m分钟s秒') {
		if (!second) return false;
		let sDate = this.date_second();
		let value = {
			day: parseInt(second / sDate.day),
			hour: parseInt((second % sDate.day) / sDate.h),
			minute: parseInt((second % sDate.h) / sDate.m),
			second: second % sDate.m
		};

		let arrList = Object.keys(value);
		for (let i = 0; i < arrList.length; i++) {
			value[arrList[i]] = this.auto_append_zero(value[arrList[i]]);
		}
		let dateStr = format.replace(/DD/g, value.day);
		dateStr = dateStr.replace(/h/g, value.hour);
		dateStr = dateStr.replace(/m/g, value.minute);
		dateStr = dateStr.replace(/s/g, value.second);
		return dateStr;
	},

	// 将日期转为秒数
	/**
	 * 
	 * @param {*} date 							需要进行转换的日期
	 * @param {*} format 						单位，默认转为秒，可选值 s | ms
	 * @returns { String || Number } 转换后的毫秒 | 秒
	 */
	date_mturn_second(date, format = 's') {
		if (typeof date == 'string') date = date.replace(/-/g, '/')
		let result = new Date(date).getTime()
		if (format == 's') result = parseInt(result / 1000)
		return result
	},

	/**
	 * 获取年月日 时分秒各个单位所占的秒数
	 */
	date_second () {
		let year = new Date().getFullYear();
		let isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
		let dateObj = {
			year: (isLeapYear ? 366 : 365) * 86400,
			month: this.get_month_day_num() * 86400,
			day: 86400,
			h: 3600,
			m: 60
		};
		return dateObj;
	},

	/**
	 * 获取某个日期中的月份的天数
	 * @param { Date } date 需要获取月份的日期
	 */
	get_month_day_num (date = new Date()) {
		let curDate = new Date(date);
		var curMonth = curDate.getMonth();
		curDate.setMonth(curMonth + 1);
		curDate.setDate(0);
		return curDate.getDate();
	},

	/**
	 * 获取时间各项的数值
	 * @param { date } date 需要进行转换格式的时间，格式只要是能转换为时间的数据值就行了
	 * @return { Object }  转换后的时间
	 */
	date_object (date = new Date()) {
		let getDate = new Date(date);
		let dateObj = {
			year: getDate.getFullYear(),
			month: getDate.getMonth() + 1,
			day: getDate.getDate(),
			hour: getDate.getHours(),
			minute: getDate.getMinutes(),
			second: getDate.getSeconds(),
			week: this.get_week(getDate.getDay())
		};

		let arrList = Object.keys(dateObj);
		for (let i = 0; i < arrList.length; i++) {
			dateObj[arrList[i]] = this.auto_append_zero(dateObj[arrList[i]]);
		}
		return dateObj;
	},

	/**
	 *
	 * @param { Date } originDate 自己的时间
	 * @param { Date } targetDate 需要对比的时间()
	 * @param { Object } value 		时间差返回的对象
	 */
	time_diff (originDate, targetDate, format = 'DD天 h小时m分钟s秒') {
		let time_diffNumber = new Date(targetDate).getTime() - new Date(originDate).getTime();
		let flag = !!(time_diffNumber > 0);
		if (!flag) {
			time_diffNumber = Math.abs(time_diffNumber);
		}

		let value = {
			dateString: this.second_mturn_date(time_diffNumber / 1000, format),
			isOld: flag
		};
		return value;
	},

	/**
	 * 小于10自动补0
	 * @param { Number } num 需要进行补0的值
	 */
	auto_append_zero (num) {
		if (num < 10) return `0${num}`;
		return num;
	},

	/**
	 * 获取星期几
	 * @param { Number } weekNum 从日期格式化取出来的值
	 */
	get_week (weekNum, format = '周') {
		let week = '';
		if (weekNum == 0) week = `${format}日`;
		if (weekNum == 1) week = `${format}一`;
		if (weekNum == 2) week = `${format}二`;
		if (weekNum == 3) week = `${format}三`;
		if (weekNum == 4) week = `${format}四`;
		if (weekNum == 5) week = `${format}五`;
		if (weekNum == 6) week = `${format}六`;
		return week;
	}
}

export default DateMethods;
